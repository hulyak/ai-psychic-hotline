#!/bin/bash

cards=(
  "fool:The Fool:0"
  "magician:The Magician:I"
  "high-priestess:The High Priestess:II"
  "empress:The Empress:III"
  "emperor:The Emperor:IV"
  "hierophant:The Hierophant:V"
  "lovers:The Lovers:VI"
  "chariot:The Chariot:VII"
  "strength:Strength:VIII"
  "hermit:The Hermit:IX"
  "wheel-of-fortune:Wheel of Fortune:X"
  "justice:Justice:XI"
  "hanged-man:The Hanged Man:XII"
  "death:Death:XIII"
  "temperance:Temperance:XIV"
  "devil:The Devil:XV"
  "tower:The Tower:XVI"
  "star:The Star:XVII"
  "moon:The Moon:XVIII"
  "sun:The Sun:XIX"
  "judgement:Judgement:XX"
  "world:The World:XXI"
)

for card in "${cards[@]}"; do
  IFS=':' read -r id name number <<< "$card"
  cat > "${id}.svg" << SVGEOF
<svg width="200" height="350" xmlns="http://www.w3.org/2000/svg">
  <!-- Card background: warm burnt orange -->
  <rect width="200" height="350" fill="#7c2d12"/>
  
  <!-- Outer border in bright candlelight orange -->
  <rect
    x="10"
    y="10"
    width="180"
    height="330"
    fill="none"
    stroke="#f97316"
    stroke-width="2"
  />
  
  <!-- Inner panel: slightly darker, like a printed area -->
  <rect
    x="20"
    y="60"
    width="160"
    height="230"
    fill="#1c1917"
    stroke="#a3e635"
    stroke-width="1"
  />
  
  <!-- Card name (bone-colored) -->
  <text
    x="100"
    y="40"
    font-family="serif"
    font-size="18"
    fill="#fef3c7"
    text-anchor="middle"
  >
    ${name}
  </text>
  
  <!-- Card number or symbol (orange accent) -->
  <text
    x="100"
    y="215"
    font-family="serif"
    font-size="24"
    fill="#f97316"
    text-anchor="middle"
  >
    ${number}
  </text>
</svg>
SVGEOF
done

echo "Generated ${#cards[@]} card SVG files"
