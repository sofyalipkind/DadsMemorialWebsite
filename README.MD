# Memorial Website for Aleksey Lipkind

A beautiful, bilingual (English/Russian) memorial website to celebrate and remember Aleksey Lipkind (1980-2023).

## Features

- **Bilingual Support**: Toggle between English and Russian with one click
- **Photo Gallery**: Interactive gallery with lightbox viewer
- **Message Wall**: Visitors can share memories and messages
- **Responsive Design**: Works perfectly on all devices
- **Modern Animations**: Smooth scroll animations and transitions
- **No Backend Required**: Uses localStorage for message storage

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

## Deployment Options

### Option 1: Netlify (Recommended - Free)

1. Go to [netlify.com](https://www.netlify.com)
2. Sign up for a free account
3. Drag and drop your entire project folder onto the Netlify dashboard
4. Your site will be live instantly with a URL like `amazing-site-123.netlify.app`
5. Optional: Configure a custom domain in Netlify settings

### Option 2: GitHub Pages (Free)

1. Create a GitHub account
2. Create a new repository
3. Upload all files
4. Go to Settings → Pages
5. Select "Deploy from a branch" and choose "main"
6. Your site will be available at `yourusername.github.io/repository-name`

### Option 3: Vercel (Free)

1. Go to [vercel.com](https://vercel.com)
2. Sign up and connect your GitHub account
3. Import your repository
4. Deploy with one click

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

## Future Enhancements

Consider these upgrades:

1. **Backend Integration**: Replace localStorage with a database for permanent message storage
2. **Image Upload**: Allow visitors to upload photos
3. **Email Notifications**: Alert family when new messages are posted
4. **Social Sharing**: Add share buttons for social media
5. **Video Support**: Include video memories

## Support

If you need help setting up or customizing the memorial website, consider:

1. Checking browser developer console for errors (F12)
2. Validating HTML at [validator.w3.org](https://validator.w3.org)
3. Testing on different devices and browsers

## License

This memorial website template is provided with love and respect. Feel free to use and modify it to honor your loved ones.

---

*Created in loving memory of Aleksey Lipkind*