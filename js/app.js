// Supabase configuration
const SUPABASE_URL = 'https://lgvlzkqgzoycnbtxaaqk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxndmx6a3Fnem95Y25idHhhYXFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxNzk4ODYsImV4cCI6MjA2NTc1NTg4Nn0.hgg0yNOOtkIsDNI9wSSBog84glG28eNaI1m3ah839Hw';
let supabase;

// Initialize Supabase
if (typeof window !== 'undefined' && window.supabase) {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

// Translations object
const translations = {
    en: {
        mainTitle: "In Loving Memory of Aleksey Lipkind",
        lifeDates: "June 22 1963 - June 10 2025",
        bioTitle: "Remembering Aleksey",
        bioText: "This space is dedicated to the memory of Aleksey Lipkind, a beloved friend, family member, and engineer. His wisdom and tenacity touched countless hearts and will forever remain in our memories.",
        bioText2: "We invite you to share your memories, stories, and photos to celebrate his life.",
        galleryTitle: "Photo Gallery",
        messagesTitle: "Messages & Memories",
        nameLabel: "Your Name (optional)",
        messageLabel: "Your Message",
        submitButton: "Share Memory",
        footerText: "Forever in our hearts",
        anonymous: "Anonymous",
        uploadButton: "Upload Photos"
    },
    ru: {
        mainTitle: "Светлой памяти Алексея Липкинда",
        lifeDates: "22 июня 1963 — 10 июня 2025",
        bioTitle: "Памяти Алексея",
        bioText: "Это страница посвящена памяти Алексея Липкинда, любимого мужа, отца, друга, и инженера. Его жизнелюбие и широкая душа тронули бесчисленные сердца и навсегда останутся в нашей памяти.",
        bioText2: "Мы приглашаем вас поделиться своими воспоминаниями, историями и фотографиями, чтобы отпраздновать замечательную жизнь, которую он прожил.",
        galleryTitle: "Фотогалерея",
        messagesTitle: "Сообщения и воспоминания",
        nameLabel: "Ваше имя (необязательно)",
        messageLabel: "Ваше сообщение",
        submitButton: "Поделиться воспоминанием",
        footerText: "Навсегда в наших сердцах",
        anonymous: "Аноним",
        uploadButton: "Загрузить фото"
    }
};

// Gallery media from the images folder (images and videos)
const galleryMedia = [
    '1998. Sonya, Nataliya and Dad.jpg',
    '1998_moscow.jpg',
    '1998_newborn.jpg',
    '2004 San Francisco.JPG',
    '2017.jpg',
    '2018.jpg',
    '2020 Friends New Years.JPG',
    '2024_Yellowstone_cabin.jpg',
    '2024_Yellowstone_outside_cabin.jpg',
    '2025 Alcatraz.JPG',
    '2025_Alcatraz.jpg',
    'Alex with a cat.jpg',
    'At work 1.jpg',
    'At work 2.jpg',
    'Father-daughter dance.JPG',
    'Flying Turkish 1.jpg',
    'Flying Turkish 2.jpg',
    'France.jpg',
    'Half Moon Bay 2022.jpg',
    'Ireland.jpg',
    'Istanbul 2025.jpg',
    'KLA 2003.JPG',
    'KLA.JPG',
    'KLA2.jpg',
    'KLA3.jpg',
    'Miami. "Life is a beach".jpg',
    'Mission Pizza.JPG',
    'Mission Pizza.jpg',
    'Moss Beach 2025.jpg',
    'Pacific Fleet.jpg',
    'Starting family.JPG',
    'Taiwan 1.jpg',
    'Taiwan 2.jpg',
    'Thailand 2024.jpg',
    'Viva Las Vegas 2024.jpg',
    'With friends.jpg',
    'Wyoming 4.jpg',
    'Wyoming May 2025.jpg',
    'Yellowstone. Old Faithful geyser.jpg',
    'kids.jpg',
    'navy_boys.jpg',
    'snowmobile_tada.mp4',
    'teenage_karate.jpg',
    'Москва 4 января 2025.jpg',
    'Москва 4 января 2025_1.jpg',
    'Навеки в памяти :( .jpg',
    'Щербинка апрель 2022.jpg'
];

function isVideo(filename) {
    return filename.toLowerCase().endsWith('.mp4');
}

// Global variables
let currentLang = localStorage.getItem('preferredLang') || 'en';
let currentImageIndex = 0;
let galleryScrollPosition = 0;
let isScrolling = false;
let scrollInterval = null;
let imagesLoaded = 0;

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', async () => {
    setLanguage(currentLang);
    initializeGallery();
    await initializeMessageWall();
    initializeLightbox();
    initializeMessageLightbox();
    initializeAnimations();
    
    // Language toggle
    document.getElementById('lang-toggle').addEventListener('click', toggleLanguage);
    
    // Message form
    document.getElementById('message-form').addEventListener('submit', handleMessageSubmit);
});

// Language functions
function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('preferredLang', lang);
    
    // Update lang attribute
    document.documentElement.lang = lang;
    
    // Update all translatable elements
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
    
    // Update language toggle button
    document.getElementById('lang-text').textContent = lang === 'en' ? 'RU' : 'EN';
    
    // Update page title
    document.title = translations[lang].mainTitle;
}

function toggleLanguage() {
    const newLang = currentLang === 'en' ? 'ru' : 'en';
    setLanguage(newLang);
}

// Gallery functions
function initializeGallery() {
    const galleryGrid = document.querySelector('.gallery-grid');
    
    if (!galleryGrid) {
        return;
    }
    
    // Simple single-row layout first to ensure images show
    galleryMedia.forEach((media, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item fade-in-up';
        galleryItem.setAttribute('data-index', index);
        
        if (isVideo(media)) {
            galleryItem.classList.add('video');
            const video = document.createElement('video');
            video.src = `images/${media}`;
            video.muted = true;
            video.preload = 'metadata';
            galleryItem.appendChild(video);
        } else {
            const img = document.createElement('img');
            img.src = `images/${media}`;
            img.alt = `Photo of Aleksey`;
            img.loading = 'lazy';
            
            // Set dimensions immediately
            img.style.height = '390px';
            img.style.width = 'auto';
            
            
            galleryItem.appendChild(img);
        }
        
        // Add to gallery immediately
        galleryGrid.appendChild(galleryItem);
        
        // Add click handler
        galleryItem.addEventListener('click', () => openLightbox(index));
    });
    
    initializeGalleryScroll();
}


function initializeGalleryScroll() {
    const leftZone = document.querySelector('.gallery-scroll-zone.left');
    const rightZone = document.querySelector('.gallery-scroll-zone.right');
    const galleryGrid = document.querySelector('.gallery-grid');
    
    // Mouse enter/leave for left scroll zone
    leftZone.addEventListener('mouseenter', () => startScrolling('left'));
    leftZone.addEventListener('mouseleave', stopScrolling);
    
    // Mouse enter/leave for right scroll zone
    rightZone.addEventListener('mouseenter', () => startScrolling('right'));
    rightZone.addEventListener('mouseleave', stopScrolling);
    
    // Update scroll position
    function updateScrollPosition() {
        galleryGrid.scrollLeft = Math.abs(galleryScrollPosition);
    }
    
    function startScrolling(direction) {
        if (isScrolling) return;
        
        isScrolling = true;
        const scrollSpeed = 3;
        const maxScroll = getMaxScrollDistance();
        
        scrollInterval = setInterval(() => {
            if (direction === 'left') {
                galleryScrollPosition = Math.max(galleryScrollPosition - scrollSpeed, 0);
            } else {
                galleryScrollPosition = Math.min(galleryScrollPosition + scrollSpeed, maxScroll);
            }
            
            updateScrollPosition();
            
            // Stop if we've reached the limits
            if ((direction === 'left' && galleryScrollPosition <= 0) || 
                (direction === 'right' && galleryScrollPosition >= maxScroll)) {
                stopScrolling();
            }
        }, 16); // ~60fps
    }
    
    function stopScrolling() {
        isScrolling = false;
        if (scrollInterval) {
            clearInterval(scrollInterval);
            scrollInterval = null;
        }
    }
    
    function getMaxScrollDistance() {
        const grid = document.querySelector('.gallery-grid');
        if (!grid) return 0;
        
        return Math.max(0, grid.scrollWidth - grid.clientWidth);
    }
    
    // Handle wheel scrolling as well
    const galleryContainer = document.querySelector('.gallery-container');
    galleryContainer.addEventListener('wheel', (e) => {
        e.preventDefault();
        const maxScroll = getMaxScrollDistance();
        const scrollAmount = e.deltaY > 0 ? 50 : -50;
        
        galleryScrollPosition = Math.max(0, Math.min(maxScroll, galleryScrollPosition + scrollAmount));
        updateScrollPosition();
    });
}

// Lightbox functions
function initializeLightbox() {
    const lightbox = document.getElementById('lightbox');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    
    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', () => navigateLightbox(-1));
    nextBtn.addEventListener('click', () => navigateLightbox(1));
    
    // Click outside to close
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (lightbox.hidden) return;
        
        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                navigateLightbox(-1);
                break;
            case 'ArrowRight':
                navigateLightbox(1);
                break;
        }
    });
}

function openLightbox(index) {
    currentImageIndex = index;
    const lightbox = document.getElementById('lightbox');
    const img = document.getElementById('lightbox-img');
    const caption = document.getElementById('lightbox-caption');
    const currentMedia = galleryMedia[index];
    
    if (isVideo(currentMedia)) {
        // Replace img with video element
        const video = document.createElement('video');
        video.src = `images/${currentMedia}`;
        video.controls = true;
        video.autoplay = true;
        video.id = 'lightbox-img';
        video.style.maxWidth = '100%';
        video.style.maxHeight = '80vh';
        video.style.objectFit = 'contain';
        video.style.borderRadius = 'var(--border-radius)';
        
        img.parentNode.replaceChild(video, img);
    } else {
        // Ensure we have an img element
        if (img.tagName !== 'IMG') {
            const newImg = document.createElement('img');
            newImg.id = 'lightbox-img';
            newImg.alt = '';
            newImg.style.maxWidth = '100%';
            newImg.style.maxHeight = '80vh';
            newImg.style.objectFit = 'contain';
            newImg.style.borderRadius = 'var(--border-radius)';
            newImg.style.transform = 'scale(0.9)';
            newImg.style.transition = 'transform 0.3s ease';
            
            img.parentNode.replaceChild(newImg, img);
        }
        
        const imgElement = document.getElementById('lightbox-img');
        imgElement.src = `images/${currentMedia}`;
    }
    
    // Extract filename without extension for caption
    const filename = currentMedia.replace(/\.[^/.]+$/, '').replace(/_/g, ' ');
    caption.textContent = filename;
    
    // Show lightbox
    lightbox.hidden = false;
    setTimeout(() => lightbox.classList.add('active'), 10);
    
    // Preload adjacent media
    preloadMedia((index + 1) % galleryMedia.length);
    preloadMedia((index - 1 + galleryMedia.length) % galleryMedia.length);
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    setTimeout(() => lightbox.hidden = true, 300);
}

function navigateLightbox(direction) {
    currentImageIndex = (currentImageIndex + direction + galleryMedia.length) % galleryMedia.length;
    openLightbox(currentImageIndex);
}

function preloadMedia(index) {
    const media = galleryMedia[index];
    if (isVideo(media)) {
        const video = document.createElement('video');
        video.src = `images/${media}`;
        video.preload = 'metadata';
    } else {
        const img = new Image();
        img.src = `images/check/${media}`;
    }
}

// Message Wall functions
async function initializeMessageWall() {
    await renderMessages();
    setupRealtimeMessages(); // Setup Realtime subscription
}

async function handleMessageSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const nameInput = form.querySelector('#author-name');
    const messageInput = form.querySelector('#message-text');
    const submitBtn = form.querySelector('.submit-btn');
    
    const name = nameInput.value.trim() || translations[currentLang].anonymous;
    const message = messageInput.value.trim();
    
    if (!message) return;
    
    // Disable submit button
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    
    try {
        // Create message object
        const newMessage = {
            name: name,
            message: message,
            created_at: new Date().toISOString(),
            is_public: true // Ensure messages are public for RLS policy
        };
        
        if (supabase) {
            // Save to Supabase
            const { data, error } = await supabase
                .from('messages')
                .insert([newMessage])
                .select();
            
            if (error) {
                console.error('Error saving message:', error);
                // Fallback to localStorage
                saveToLocalStorage(newMessage);
            }
        } else {
            // Fallback to localStorage
            saveToLocalStorage(newMessage);
        }
        
        // Clear form
        form.reset();
        
        // Re-render messages
        await renderMessages();
        
        // Scroll to messages section
        document.getElementById('messages').scrollIntoView({ behavior: 'smooth' });
        
    } catch (error) {
        console.error('Error submitting message:', error);
        // Fallback to localStorage
        saveToLocalStorage({ name, message, created_at: new Date().toISOString() });
        form.reset();
        await renderMessages();
    } finally {
        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.textContent = translations[currentLang].submitButton;
    }
}

function saveToLocalStorage(message) {
    const messages = JSON.parse(localStorage.getItem('memorialMessages')) || [];
    messages.unshift({ ...message, id: Date.now() });
    localStorage.setItem('memorialMessages', JSON.stringify(messages));
}

async function renderMessages() {
    const messageContainer = document.getElementById('message-wall');
    let messages = [];
    
    // Clear container
    messageContainer.innerHTML = '';
    
    try {
        if (supabase) {
            // Fetch from Supabase
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (error) {
                console.error('Error fetching messages:', error);
                // Fallback to localStorage
                messages = JSON.parse(localStorage.getItem('memorialMessages')) || [];
            } else {
                messages = data || [];
            }
        } else {
            // Fallback to localStorage
            messages = JSON.parse(localStorage.getItem('memorialMessages')) || [];
        }
        
        // Sample messages if none exist
        if (messages.length === 0) {
            const sampleMessages = [
                {
                    id: 1,
                    name: "Sarah Johnson",
                    message: "Aleksey was a wonderful person who always had a smile on his face. His positive energy was contagious.",
                    created_at: new Date(Date.now() - 86400000).toISOString()
                },
                {
                    id: 2,
                    name: "Michael Chen",
                    message: "I'll never forget the kindness Aleksey showed me when I needed it most. Rest in peace, dear friend.",
                    created_at: new Date(Date.now() - 172800000).toISOString()
                }
            ];
            
            if (supabase) {
                // Insert sample messages into Supabase
                const { error } = await supabase
                    .from('messages')
                    .insert(sampleMessages);
                
                if (!error) {
                    messages = sampleMessages;
                }
            } else {
                // Save to localStorage
                localStorage.setItem('memorialMessages', JSON.stringify(sampleMessages));
                messages = sampleMessages;
            }
        }
        
        // Render each message
        messages.forEach(msg => {
            const messageTile = document.createElement('div');
            messageTile.className = 'message-tile fade-in-up';
            
            const messageDate = new Date(msg.created_at || msg.date);
            const formattedDate = messageDate.toLocaleDateString(currentLang === 'ru' ? 'ru-RU' : 'en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            messageTile.innerHTML = `
                <div class="message-author">${escapeHtml(msg.name)}</div>
                <div class="message-text">${escapeHtml(msg.message)}</div>
                <div class="message-date">${formattedDate}</div>
            `;
            
            // Add click handler for lightbox
            messageTile.addEventListener('click', () => openMessageLightbox(msg));
            
            messageContainer.appendChild(messageTile);
        });
        
    } catch (error) {
        console.error('Error rendering messages:', error);
        // Fallback to localStorage
        messages = JSON.parse(localStorage.getItem('memorialMessages')) || [];
        
        messages.forEach(msg => {
            const messageTile = document.createElement('div');
            messageTile.className = 'message-tile fade-in-up';
            
            const messageDate = new Date(msg.created_at || msg.date);
            const formattedDate = messageDate.toLocaleDateString(currentLang === 'ru' ? 'ru-RU' : 'en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            messageTile.innerHTML = `
                <div class="message-author">${escapeHtml(msg.name)}</div>
                <div class="message-text">${escapeHtml(msg.message)}</div>
                <div class="message-date">${formattedDate}</div>
            `;
            
            // Add click handler for lightbox
            messageTile.addEventListener('click', () => openMessageLightbox(msg));
            
            messageContainer.appendChild(messageTile);
        });
    }
    
    // Re-observe new elements for animations
    observeElements();
}

// Realtime functions
function setupRealtimeMessages() {
    if (!supabase) {
        console.warn('Supabase client not initialized for Realtime.');
        return;
    }

    supabase
        .channel('messages_channel') // You can name your channel anything
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
            console.log('New message received via Realtime:', payload.new);
            // Add the new message to the top of the wall
            const messageContainer = document.getElementById('message-wall');
            const messageTile = document.createElement('div');
            messageTile.className = 'message-tile fade-in-up';

            const messageDate = new Date(payload.new.created_at);
            const formattedDate = messageDate.toLocaleDateString(currentLang === 'ru' ? 'ru-RU' : 'en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            messageTile.innerHTML = `
                <div class="message-author">${escapeHtml(payload.new.name)}</div>
                <div class="message-text">${escapeHtml(payload.new.message)}</div>
                <div class="message-date">${formattedDate}</div>
            `;
            
            // Add click handler for lightbox
            messageTile.addEventListener('click', () => openMessageLightbox(payload.new));
            
            // Insert at the beginning to show newest messages first
            messageContainer.prepend(messageTile);
            observeElements(); // Re-observe for animation
        })
        .subscribe();
}

// Animation functions
function initializeAnimations() {
    observeElements();
}

function observeElements() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px'
    });
    
    // Observe all fade-in elements
    document.querySelectorAll('.fade-in-up:not(.visible)').forEach(el => {
        observer.observe(el);
    });
}


// Message Lightbox functions
function initializeMessageLightbox() {
    const messageLightbox = document.getElementById('message-lightbox');
    const closeBtn = messageLightbox.querySelector('.message-lightbox-close');
    
    closeBtn.addEventListener('click', closeMessageLightbox);
    
    // Click outside to close
    messageLightbox.addEventListener('click', (e) => {
        if (e.target === messageLightbox) {
            closeMessageLightbox();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (messageLightbox.hidden) return;
        
        if (e.key === 'Escape') {
            closeMessageLightbox();
        }
    });
}

function openMessageLightbox(message) {
    const messageLightbox = document.getElementById('message-lightbox');
    const author = messageLightbox.querySelector('.message-lightbox-author');
    const text = messageLightbox.querySelector('.message-lightbox-text');
    const date = messageLightbox.querySelector('.message-lightbox-date');
    
    // Set content
    author.textContent = message.name || translations[currentLang].anonymous;
    text.textContent = message.message;
    
    // Format date
    const messageDate = new Date(message.created_at || message.date);
    const formattedDate = messageDate.toLocaleDateString(currentLang === 'ru' ? 'ru-RU' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    date.textContent = formattedDate;
    
    // Apply random font to the message text
    const fonts = [
        'Georgia, serif',
        'Trebuchet MS, sans-serif',
        'Times New Roman, serif',
        'Verdana, sans-serif',
        'Palatino, serif',
        'Tahoma, sans-serif',
        'Book Antiqua, serif',
        'Arial, sans-serif',
        'Garamond, serif',
        'Helvetica, sans-serif'
    ];
    const randomFont = fonts[Math.floor(Math.random() * fonts.length)];
    text.style.fontFamily = randomFont;
    
    // Show lightbox
    messageLightbox.hidden = false;
    setTimeout(() => messageLightbox.classList.add('active'), 10);
}

function closeMessageLightbox() {
    const messageLightbox = document.getElementById('message-lightbox');
    messageLightbox.classList.remove('active');
    setTimeout(() => messageLightbox.hidden = true, 300);
}

// Utility functions
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}
