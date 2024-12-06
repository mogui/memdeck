# Memdeck Trainer

A web application for practicing and learning memorized deck stacks for card magic. Currently supports:
- Mnemonica Stack
- Aronson Stack
- Redford Stack

## Features
- Interactive deck display
- Position quiz mode
- Card quiz mode
- Mobile-friendly design

## Usage
Visit the [live site](https://mogui.it/memdeck) to start practicing!

## Local Development
1. Clone the repository
2. Open `index.html` in your browser
3. No build process required - it's all static HTML, CSS, and JavaScript

## Contributing New Stacks
Want to add your favorite memorized deck? Great! Here's how:

1. Fork this repository
2. Edit `stacks.js` and add your stack to the `cardStacks` object:
```javascript
cardStacks = {
    existing_stack: [...],
    your_stack_name: [
        // Add your 52 cards in order using the format:
        // "VS" where V is value (A,2-10,J,Q,K) and S is suit (H,S,D,C)
        "AH", "2D", "QS", // etc...
    ]
}
```
3. Submit a pull request with:
   - The complete stack order
   - A brief description of the stack's history/creator
   - Any relevant references or resources

Please ensure your stack contains exactly 52 cards and uses the correct card notation format.
