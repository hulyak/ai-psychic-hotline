import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from '../page';

// Mock fetch globally
global.fetch = jest.fn();

describe('AI Psychic Hotline - Core Reading Flow', () => {
  beforeEach(() => {
    // Reset fetch mock before each test
    (global.fetch as jest.Mock).mockReset();
  });

  describe('Complete reading flow', () => {
    it('should complete full reading flow: realm selection → question → cards and fortune display', async () => {
      const user = userEvent.setup();

      // Mock successful API response
      const mockResponse = {
        cards: [
          {
            id: 'fool',
            name: 'The Fool',
            orientation: 'upright',
            imageUrl: '/cards/fool.svg'
          },
          {
            id: 'tower',
            name: 'The Tower',
            orientation: 'reversed',
            imageUrl: '/cards/tower.svg'
          },
          {
            id: 'moon',
            name: 'The Moon',
            orientation: 'upright',
            imageUrl: '/cards/moon.svg'
          }
        ],
        fortune: 'The spirits whisper of new beginnings shrouded in chaos. The Fool walks blindly as The Tower crumbles in reverse, suggesting disaster narrowly avoided. Yet The Moon reveals hidden truths lurking in shadow. Beware the path ahead, seeker.'
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      // Render the app
      render(<Home />);

      // Step 1: Verify realm selection is shown
      expect(screen.getByText(/Choose Your Realm/i)).toBeInTheDocument();

      // Step 2: Select a realm (Realm of Fate)
      const fateRealmButton = screen.getByRole('button', { name: /Realm of Fate/i });
      await user.click(fateRealmButton);

      // Step 3: Verify question input is shown
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/What mysteries shall we unveil/i)).toBeInTheDocument();
      });

      // Step 4: Enter a question
      const questionInput = screen.getByPlaceholderText(/What mysteries shall we unveil/i);
      await user.type(questionInput, 'Will I find success in my career?');

      // Step 5: Submit the question
      const submitButton = screen.getByRole('button', { name: /Summon Reading/i });
      await user.click(submitButton);

      // Step 6: Verify loading state
      expect(submitButton).toBeDisabled();

      // Step 7: Wait for and verify cards are displayed
      await waitFor(() => {
        expect(screen.getByText('The Fool')).toBeInTheDocument();
        expect(screen.getByText('The Tower')).toBeInTheDocument();
        expect(screen.getByText('The Moon')).toBeInTheDocument();
      });

      // Step 8: Verify fortune text is displayed
      expect(screen.getByText(/The spirits whisper of new beginnings/i)).toBeInTheDocument();

      // Step 9: Verify API was called correctly
      expect(global.fetch).toHaveBeenCalledWith('/api/fortune', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: 'Will I find success in my career?',
          mode: 'fate',
          generateImages: false
        }),
      });
    });
  });

  describe('Validation', () => {
    it('should show error when submitting empty question', async () => {
      const user = userEvent.setup();

      render(<Home />);

      // Select realm first
      const loveRealmButton = screen.getByRole('button', { name: /Realm of Love/i });
      await user.click(loveRealmButton);

      // Wait for question input
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/What mysteries shall we unveil/i)).toBeInTheDocument();
      });

      // Try to submit without entering a question
      const submitButton = screen.getByRole('button', { name: /Summon Reading/i });
      
      // Button should be disabled when input is empty
      expect(submitButton).toBeDisabled();
    });
  });

  describe('New reading', () => {
    it('should clear previous reading and return to input when starting new reading', async () => {
      const user = userEvent.setup();

      // Mock successful API response
      const mockResponse = {
        cards: [
          {
            id: 'death',
            name: 'Death',
            orientation: 'upright',
            imageUrl: '/cards/death.svg'
          }
        ],
        fortune: 'Transformation awaits you, seeker.'
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      render(<Home />);

      // Complete a reading
      const shadowsRealmButton = screen.getByRole('button', { name: /Realm of Shadows/i });
      await user.click(shadowsRealmButton);

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/What mysteries shall we unveil/i)).toBeInTheDocument();
      });

      const questionInput = screen.getByPlaceholderText(/What mysteries shall we unveil/i);
      await user.type(questionInput, 'What should I fear?');

      const submitButton = screen.getByRole('button', { name: /Summon Reading/i });
      await user.click(submitButton);

      // Wait for reading to display
      await waitFor(() => {
        expect(screen.getByText('Death')).toBeInTheDocument();
        expect(screen.getByText(/Transformation awaits you/i)).toBeInTheDocument();
      });

      // Click "New Reading" button
      const newReadingButton = screen.getByRole('button', { name: /New Reading/i });
      await user.click(newReadingButton);

      // Verify we're back to input state
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/What mysteries shall we unveil/i)).toBeInTheDocument();
      });

      // Verify previous reading is cleared
      expect(screen.queryByText('Death')).not.toBeInTheDocument();
      expect(screen.queryByText(/Transformation awaits you/i)).not.toBeInTheDocument();
    });
  });

  describe('Error handling', () => {
    it('should show error banner when API fails and allow retry', async () => {
      const user = userEvent.setup();

      // Mock API failure
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error('Network error')
      );

      render(<Home />);

      // Select realm and enter question
      const fateRealmButton = screen.getByRole('button', { name: /Realm of Fate/i });
      await user.click(fateRealmButton);

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/What mysteries shall we unveil/i)).toBeInTheDocument();
      });

      const questionInput = screen.getByPlaceholderText(/What mysteries shall we unveil/i);
      await user.type(questionInput, 'What lies ahead?');

      const submitButton = screen.getByRole('button', { name: /Summon Reading/i });
      await user.click(submitButton);

      // Wait for error banner to appear
      await waitFor(() => {
        expect(screen.getByText(/Network error/i)).toBeInTheDocument();
      });

      // Verify retry button is present
      const retryButton = screen.getByRole('button', { name: /Try again/i });
      expect(retryButton).toBeInTheDocument();

      // Mock successful response for retry
      const mockResponse = {
        cards: [
          {
            id: 'star',
            name: 'The Star',
            orientation: 'upright',
            imageUrl: '/cards/star.svg'
          }
        ],
        fortune: 'Hope shines through the darkness.'
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      // Click retry
      await user.click(retryButton);

      // Verify reading is displayed after retry
      await waitFor(() => {
        expect(screen.getByText('The Star')).toBeInTheDocument();
        expect(screen.getByText(/Hope shines through the darkness/i)).toBeInTheDocument();
      });

      // Verify error banner is gone
      expect(screen.queryByText(/Network error/i)).not.toBeInTheDocument();
    });
  });
});
