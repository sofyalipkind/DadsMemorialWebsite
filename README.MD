# Memorial Website for Aleksey Lipkind

A bilingual (English/Russian) memorial website to celebrate and remember my father, Aleksey Lipkind (1963-2025).

## Features

- **Bilingual Support**: Toggle between English and Russian with one click
- **Photo Gallery**: Interactive gallery with lightbox viewer
- **Message Wall**: Visitors can share memories and messages
- **Responsive Design**: Works perfectly on all devices
- **Modern Animations**: Smooth scroll animations and transitions

## Project Structure

```
memorial-website/
├── index.html              # Main HTML file
├── css/
│   └── style.css          # All styles and animations
├── js/
│   └── app.js             # JavaScript functionality
├── assets/
│   ├── img/               # Photo gallery images
│   │   ├── photo_01.jpg
│   │   ├── photo_02.jpg
│   │   └── ...
│   └── icons/            # Icon files (optional)
└── README.md             # This file
```

## Setup Instructions

### 1. Download the Code

Download all the files and maintain the folder structure shown above.

### 2. Add Your Photos

1. Place your photos in the `assets/img/` folder
2. Name them descriptively (e.g., `aleksey-at-beach.jpg`, `family-gathering-2022.jpg`)
3. Update the `galleryImages` array in `js/app.js` with your image filenames:

```javascript
const galleryImages = [
    'your-photo-1.jpg',
    'your-photo-2.jpg',
    'your-photo-3.jpg',
    // Add all your photos here
];
```

### 3. Customize Content

#### Update Biography
In `index.html`, find the biography section and update the text:

```html
<p data-i18n="bioText">Your custom biography text here...</p>
```

#### Update Translations
In `js/app.js`, modify the `translations` object to customize all text in both languages:

```javascript
const translations = {
    en: {
        bioText: "Your English biography...",
        // Other text...
    },
    ru: {
        bioText: "Ваша биография на русском...",
        // Other text...
    }
};
```

### 4. Test Locally

1. Open `index.html` in a web browser
2. Test all features:
   - Language toggle
   - Photo gallery navigation
   - Message submission
   - Responsive design (resize browser)

## Customization Guide

### Colors
Edit the CSS variables in `css/style.css`:

```css
:root {
    --color-bg: #f4f4f9;        /* Background color */
    --color-primary: #2d3e50;   /* Primary text color */
    --color-accent: #a9c1d9;    /* Accent color for buttons */
}
```

### Fonts
Change the Google Fonts import in `index.html`:

```html
<link href="https://fonts.googleapis.com/css2?family=YourFont:wght@400;600&display=swap" rel="stylesheet">
```

### Layout
Modify grid settings in `css/style.css`:

```css
.gallery-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
}
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Troubleshooting

### Images Not Showing
- Check file paths are correct
- Ensure image filenames match exactly (case-sensitive)
- Verify images are in `assets/img/` folder

### Messages Not Saving
- localStorage must be enabled in the browser
- Some browsers block localStorage in private/incognito mode

### Language Toggle Not Working
- Clear browser cache
- Check browser console for JavaScript errors

## License

This memorial website template is provided with love and respect. Feel free to use and modify it to honor your loved ones.

---

*Created in loving memory of Aleksey Lipkind. May his memory be a blessing.*
