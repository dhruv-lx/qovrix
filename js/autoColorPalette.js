/**
 * Auto Color Palette - Generate professional color schemes automatically
 * Modular architecture - completely isolated from core logic
 * USER EDITOR ONLY
 */

class AutoColorPalette {
    constructor() {
        this.themes = {
            modern: {
                name: 'Modern',
                colors: {
                    primary: '#3b82f6',
                    secondary: '#10b981',
                    accent: '#f59e0b',
                    background: '#f8fafc',
                    text: '#1e293b'
                }
            },
            bold: {
                name: 'Bold',
                colors: {
                    primary: '#dc2626',
                    secondary: '#f97316',
                    accent: '#eab308',
                    background: '#000000',
                    text: '#ffffff'
                }
            },
            elegant: {
                name: 'Elegant',
                colors: {
                    primary: '#7c3aed',
                    secondary: '#ec4899',
                    accent: '#f59e0b',
                    background: '#faf5ff',
                    text: '#1f2937'
                }
            },
            minimal: {
                name: 'Minimal',
                colors: {
                    primary: '#6b7280',
                    secondary: '#9ca3af',
                    accent: '#3b82f6',
                    background: '#ffffff',
                    text: '#111827'
                }
            },
            ocean: {
                name: 'Ocean',
                colors: {
                    primary: '#0891b2',
                    secondary: '#06b6d4',
                    accent: '#22d3ee',
                    background: '#f0f9ff',
                    text: '#0c4a6e'
                }
            },
            sunset: {
                name: 'Sunset',
                colors: {
                    primary: '#f97316',
                    secondary: '#fb923c',
                    accent: '#fbbf24',
                    background: '#fff7ed',
                    text: '#7c2d12'
                }
            },
            forest: {
                name: 'Forest',
                colors: {
                    primary: '#16a34a',
                    secondary: '#22c55e',
                    accent: '#84cc16',
                    background: '#f0fdf4',
                    text: '#14532d'
                }
            },
            candy: {
                name: 'Candy',
                colors: {
                    primary: '#ec4899',
                    secondary: '#f472b6',
                    accent: '#f9a8d4',
                    background: '#fdf2f8',
                    text: '#831843'
                }
            }
        };

        this.currentPalette = null;
        this.extractedColors = [];
    }

    /**
     * Extract colors from uploaded logo using canvas
     */
    async extractColorsFromLogo(imageFile) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    try {
                        const colors = this.analyzeImage(img);
                        resolve(colors);
                    } catch (error) {
                        reject(error);
                    }
                };
                img.onerror = () => reject(new Error('Failed to load image'));
                img.src = e.target.result;
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsDataURL(imageFile);
        });
    }

    /**
     * Analyze image and extract dominant colors
     */
    analyzeImage(img) {
        // Create canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Resize for performance (max 100px)
        const maxSize = 100;
        let width = img.width;
        let height = img.height;
        
        if (width > height) {
            if (width > maxSize) {
                height = (height * maxSize) / width;
                width = maxSize;
            }
        } else {
            if (height > maxSize) {
                width = (width * maxSize) / height;
                height = maxSize;
            }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw image
        ctx.drawImage(img, 0, 0, width, height);
        
        // Get image data
        const imageData = ctx.getImageData(0, 0, width, height);
        const pixels = imageData.data;
        
        // Color frequency map
        const colorMap = {};
        
        // Sample pixels (every 10th pixel for performance)
        for (let i = 0; i < pixels.length; i += 40) { // 4 channels * 10 pixels
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];
            const a = pixels[i + 3];
            
            // Skip transparent pixels
            if (a < 128) continue;
            
            // Quantize colors to reduce variations
            const qr = Math.round(r / 32) * 32;
            const qg = Math.round(g / 32) * 32;
            const qb = Math.round(b / 32) * 32;
            
            const key = `${qr},${qg},${qb}`;
            colorMap[key] = (colorMap[key] || 0) + 1;
        }
        
        // Sort by frequency
        const sortedColors = Object.entries(colorMap)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10) // Top 10 colors
            .map(([color]) => {
                const [r, g, b] = color.split(',').map(Number);
                return this.rgbToHex(r, g, b);
            });
        
        // Generate palette from extracted colors
        return this.generatePaletteFromColors(sortedColors);
    }

    /**
     * Generate color palette from extracted colors
     */
    generatePaletteFromColors(colors) {
        if (colors.length === 0) {
            return this.themes.modern.colors; // Fallback
        }
        
        // Use most dominant color as primary
        const primary = colors[0];
        
        // Generate complementary colors
        const secondary = this.getComplementaryColor(primary);
        const accent = this.getAnalogousColor(primary);
        const background = this.getLightVariant(primary);
        const text = this.getDarkVariant(primary);
        
        return {
            primary,
            secondary,
            accent,
            background,
            text
        };
    }

    /**
     * Get theme-based palette
     */
    getThemePalette(themeName) {
        return this.themes[themeName]?.colors || this.themes.modern.colors;
    }

    /**
     * Get all available themes
     */
    getAvailableThemes() {
        return Object.keys(this.themes).map(key => ({
            key,
            name: this.themes[key].name,
            colors: this.themes[key].colors
        }));
    }

    /**
     * Apply color palette to poster
     */
    applyPalette(palette) {
        const editor = window.editor;
        if (!editor) {
            console.error('Editor not found');
            return false;
        }

        // Store current state for undo
        if (typeof editor.saveState === 'function') {
            editor.saveState();
        }

        // Apply background color
        editor.backgroundColor = palette.background;
        if (editor.canvas) {
            editor.canvas.style.backgroundColor = palette.background;
        }

        // Apply colors to elements
        editor.elements.forEach(element => {
            if (element.type === 'text') {
                // Determine text importance by size
                const fontSize = element.fontSize || element.size || 16;
                
                if (fontSize > 32) {
                    // Headings - Primary color
                    element.color = palette.primary;
                    element.textColor = palette.primary;
                } else if (fontSize > 20) {
                    // Subheadings - Secondary color
                    element.color = palette.secondary;
                    element.textColor = palette.secondary;
                } else {
                    // Body text - Text color
                    element.color = palette.text;
                    element.textColor = palette.text;
                }
            } else if (element.type === 'shape') {
                // Shapes - Use accent color
                const currentBg = element.backgroundColor || element.bgColor;
                if (currentBg && currentBg !== '#ffffff' && currentBg !== '#000000') {
                    element.backgroundColor = palette.accent;
                    element.bgColor = palette.accent;
                }
            }
        });

        // Re-render canvas
        if (typeof editor.render === 'function') {
            editor.render();
        } else if (typeof editor.renderCanvas === 'function') {
            editor.renderCanvas();
        }

        // Update UI
        if (typeof editor.updatePropertyPanel === 'function') {
            editor.updatePropertyPanel();
        }

        return true;
    }

    /**
     * Preview palette on canvas (without saving)
     */
    previewPalette(palette) {
        const editor = window.editor;
        if (!editor) return false;

        // Store original colors
        const originalState = {
            backgroundColor: editor.backgroundColor,
            elements: editor.elements.map(el => ({ ...el }))
        };

        // Apply palette
        this.applyPalette(palette);

        // Return restore function
        return () => {
            editor.backgroundColor = originalState.backgroundColor;
            editor.elements = originalState.elements;
            
            if (typeof editor.render === 'function') {
                editor.render();
            } else if (typeof editor.renderCanvas === 'function') {
                editor.renderCanvas();
            }
            
            if (typeof editor.updatePropertyPanel === 'function') {
                editor.updatePropertyPanel();
            }
        };
    }

    /**
     * Color utility functions
     */
    rgbToHex(r, g, b) {
        return '#' + [r, g, b].map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    getComplementaryColor(hex) {
        const rgb = this.hexToRgb(hex);
        if (!rgb) return '#000000';
        
        const r = 255 - rgb.r;
        const g = 255 - rgb.g;
        const b = 255 - rgb.b;
        
        return this.rgbToHex(r, g, b);
    }

    getAnalogousColor(hex) {
        const rgb = this.hexToRgb(hex);
        if (!rgb) return '#000000';
        
        // Shift hue by 30 degrees
        const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
        hsl.h = (hsl.h + 30) % 360;
        const newRgb = this.hslToRgb(hsl.h, hsl.s, hsl.l);
        
        return this.rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    }

    getLightVariant(hex) {
        const rgb = this.hexToRgb(hex);
        if (!rgb) return '#ffffff';
        
        // Blend with white
        const r = Math.round(rgb.r * 0.3 + 255 * 0.7);
        const g = Math.round(rgb.g * 0.3 + 255 * 0.7);
        const b = Math.round(rgb.b * 0.3 + 255 * 0.7);
        
        return this.rgbToHex(r, g, b);
    }

    getDarkVariant(hex) {
        const rgb = this.hexToRgb(hex);
        if (!rgb) return '#000000';
        
        // Blend with black
        const r = Math.round(rgb.r * 0.3);
        const g = Math.round(rgb.g * 0.3);
        const b = Math.round(rgb.b * 0.3);
        
        return this.rgbToHex(r, g, b);
    }

    rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        
        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            
            switch (max) {
                case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
                case g: h = ((b - r) / d + 2) / 6; break;
                case b: h = ((r - g) / d + 4) / 6; break;
            }
        }
        
        return { h: h * 360, s, l };
    }

    hslToRgb(h, s, l) {
        h /= 360;
        
        let r, g, b;
        
        if (s === 0) {
            r = g = b = l;
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };
            
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }
        
        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    }

    /**
     * Get color contrast ratio
     */
    getContrastRatio(color1, color2) {
        const rgb1 = this.hexToRgb(color1);
        const rgb2 = this.hexToRgb(color2);
        
        if (!rgb1 || !rgb2) return 1;
        
        const luminance1 = this.getLuminance(rgb1);
        const luminance2 = this.getLuminance(rgb2);
        
        const lighter = Math.max(luminance1, luminance2);
        const darker = Math.min(luminance1, luminance2);
        
        return (lighter + 0.05) / (darker + 0.05);
    }

    getLuminance(rgb) {
        const { r, g, b } = rgb;
        const [rs, gs, bs] = [r, g, b].map(c => {
            c = c / 255;
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    }
}

// UI Controller for Auto Color Palette
class AutoColorPaletteUI {
    constructor() {
        this.generator = new AutoColorPalette();
        this.modal = null;
        this.currentPalette = null;
        this.previewRestore = null;
    }

    /**
     * Initialize Auto Color Palette for user editor
     */
    init() {
        this.addGenerateColorsButton();
    }

    /**
     * Add generate colors button to user editor
     */
    addGenerateColorsButton() {
        const leftPanel = document.querySelector('.left-panel');
        if (!leftPanel) return;

        // Find the elements section or create one
        let elementsSection = document.querySelector('.elements-section');
        if (!elementsSection) {
            elementsSection = document.createElement('div');
            elementsSection.className = 'elements-section';
            leftPanel.appendChild(elementsSection);
        }

        // Add Auto Color Palette section
        const colorSection = document.createElement('div');
        colorSection.className = 'elements-section';
        colorSection.innerHTML = `
            <div class="panel-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                    <path d="M12 8v4"/>
                    <circle cx="12" cy="16" r="1"/>
                </svg>
                Auto Color Palette
            </div>
            <button class="element-btn" onclick="autoColorUI.openModal()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                    <path d="M2 17l10 5 10-5"/>
                    <path d="M2 12l10 5 10-5"/>
                </svg>
                🎨 Generate Colors
            </button>
        `;

        leftPanel.appendChild(colorSection);
    }

    /**
     * Open the color palette generation modal
     */
    openModal() {
        if (this.modal) return;

        const modal = document.createElement('div');
        modal.id = 'autoColorModal';
        modal.className = 'auto-color-modal';
        modal.innerHTML = `
            <div class="color-modal-overlay" onclick="autoColorUI.closeModal()"></div>
            <div class="color-modal-container">
                <div class="color-modal-header">
                    <h3>🎨 Auto Color Palette</h3>
                    <button class="color-modal-close" onclick="autoColorUI.closeModal()">×</button>
                </div>
                <div class="color-modal-body">
                    <div class="generation-options">
                        <div class="option-tabs">
                            <button class="tab-btn active" onclick="autoColorUI.switchTab('logo')" data-tab="logo">
                                📷 Upload Logo
                            </button>
                            <button class="tab-btn" onclick="autoColorUI.switchTab('theme')" data-tab="theme">
                                🎭 Select Theme
                            </button>
                        </div>
                        
                        <div id="logoTab" class="tab-content active">
                            <div class="upload-area" id="uploadArea">
                                <input type="file" id="logoInput" accept="image/*" style="display: none;" onchange="autoColorUI.handleLogoUpload(event)">
                                <div class="upload-placeholder" onclick="document.getElementById('logoInput').click()">
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                                        <polyline points="17,8 12,3 7,8"/>
                                        <line x1="12" y1="3" x2="12" y2="15"/>
                                    </svg>
                                    <p>Click to upload logo</p>
                                    <small>PNG, JPG, GIF up to 10MB</small>
                                </div>
                            </div>
                        </div>
                        
                        <div id="themeTab" class="tab-content">
                            <div class="theme-grid">
                                ${this.generator.getAvailableThemes().map(theme => `
                                    <div class="theme-card" onclick="autoColorUI.selectTheme('${theme.key}')" data-theme="${theme.key}">
                                        <div class="theme-preview">
                                            <div class="color-swatch" style="background: ${theme.colors.primary}"></div>
                                            <div class="color-swatch" style="background: ${theme.colors.secondary}"></div>
                                            <div class="color-swatch" style="background: ${theme.colors.accent}"></div>
                                        </div>
                                        <div class="theme-name">${theme.name}</div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                    
                    <button class="generate-btn" id="generateBtn" onclick="autoColorUI.generatePalette()" disabled>
                        Generate Palette
                    </button>
                    
                    <div id="loadingState" style="display: none;">
                        <div class="loading-spinner"></div>
                        <p>Generating colors...</p>
                    </div>
                    
                    <div id="paletteResult" style="display: none;">
                        <h4>Generated Palette</h4>
                        <div class="palette-preview" id="palettePreview"></div>
                        <div class="palette-actions">
                            <button class="preview-btn" onclick="autoColorUI.previewPalette()">
                                👁️ Preview
                            </button>
                            <button class="apply-btn" onclick="autoColorUI.applyPalette()">
                                ✅ Apply Palette
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        this.addModalStyles();
        this.modal = modal;
    }

    /**
     * Switch between tabs
     */
    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.tab === tabName) {
                btn.classList.add('active');
            }
        });

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabName + 'Tab').classList.add('active');

        // Reset state
        this.currentPalette = null;
        document.getElementById('paletteResult').style.display = 'none';
        document.getElementById('generateBtn').disabled = tabName === 'logo';
    }

    /**
     * Handle logo upload
     */
    async handleLogoUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file
        if (!file.type.startsWith('image/')) {
            this.showToast('Please upload an image file', 'error');
            return;
        }

        if (file.size > 10 * 1024 * 1024) { // 10MB
            this.showToast('File size must be less than 10MB', 'error');
            return;
        }

        // Show loading
        const uploadArea = document.getElementById('uploadArea');
        uploadArea.innerHTML = `
            <div class="loading-spinner"></div>
            <p>Extracting colors...</p>
        `;

        try {
            // Extract colors
            const palette = await this.generator.extractColorsFromLogo(file);
            this.currentPalette = palette;
            
            // Show success
            uploadArea.innerHTML = `
                <div class="upload-success">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 6L9 17l-5-5"/>
                    </svg>
                    <p>Logo uploaded successfully!</p>
                    <small>Click "Generate Palette" to continue</small>
                </div>
            `;
            
            document.getElementById('generateBtn').disabled = false;
        } catch (error) {
            uploadArea.innerHTML = `
                <div class="upload-error">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="8" x2="12" y2="12"/>
                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    <p>Failed to extract colors</p>
                    <small>${error.message}</small>
                </div>
            `;
        }
    }

    /**
     * Select theme
     */
    selectTheme(themeKey) {
        // Update UI
        document.querySelectorAll('.theme-card').forEach(card => {
            card.classList.remove('selected');
        });
        document.querySelector(`[data-theme="${themeKey}"]`).classList.add('selected');

        // Get palette
        this.currentPalette = this.generator.getThemePalette(themeKey);
        document.getElementById('generateBtn').disabled = false;
    }

    /**
     * Generate palette
     */
    generatePalette() {
        if (!this.currentPalette) {
            this.showToast('Please upload a logo or select a theme', 'error');
            return;
        }

        // Show loading
        document.getElementById('loadingState').style.display = 'block';
        document.getElementById('generateBtn').disabled = true;

        // Simulate processing
        setTimeout(() => {
            document.getElementById('loadingState').style.display = 'none';
            this.displayPalette(this.currentPalette);
            document.getElementById('generateBtn').disabled = false;
        }, 1000);
    }

    /**
     * Display generated palette
     */
    displayPalette(palette) {
        const preview = document.getElementById('palettePreview');
        preview.innerHTML = `
            <div class="palette-colors">
                <div class="color-card">
                    <div class="color-swatch large" style="background: ${palette.primary}"></div>
                    <div class="color-info">
                        <div class="color-label">Primary</div>
                        <div class="color-value">${palette.primary}</div>
                    </div>
                </div>
                <div class="color-card">
                    <div class="color-swatch large" style="background: ${palette.secondary}"></div>
                    <div class="color-info">
                        <div class="color-label">Secondary</div>
                        <div class="color-value">${palette.secondary}</div>
                    </div>
                </div>
                <div class="color-card">
                    <div class="color-swatch large" style="background: ${palette.accent}"></div>
                    <div class="color-info">
                        <div class="color-label">Accent</div>
                        <div class="color-value">${palette.accent}</div>
                    </div>
                </div>
                <div class="color-card">
                    <div class="color-swatch large" style="background: ${palette.background}"></div>
                    <div class="color-info">
                        <div class="color-label">Background</div>
                        <div class="color-value">${palette.background}</div>
                    </div>
                </div>
                <div class="color-card">
                    <div class="color-swatch large" style="background: ${palette.text}"></div>
                    <div class="color-info">
                        <div class="color-label">Text</div>
                        <div class="color-value">${palette.text}</div>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('paletteResult').style.display = 'block';
    }

    /**
     * Preview palette
     */
    previewPalette() {
        if (!this.currentPalette) return;

        // Clear previous preview
        if (this.previewRestore) {
            this.previewRestore();
            this.previewRestore = null;
        }

        // Apply preview
        this.previewRestore = this.generator.previewPalette(this.currentPalette);
        
        // Update button
        const previewBtn = document.querySelector('.preview-btn');
        previewBtn.textContent = '↩️ Restore';
        previewBtn.onclick = () => {
            if (this.previewRestore) {
                this.previewRestore();
                this.previewRestore = null;
                previewBtn.textContent = '👁️ Preview';
                previewBtn.onclick = () => this.previewPalette();
            }
        };
    }

    /**
     * Apply palette
     */
    applyPalette() {
        if (!this.currentPalette) return;

        const success = this.generator.applyPalette(this.currentPalette);
        if (success) {
            this.showToast('Color palette applied successfully!', 'success');
            this.closeModal();
        } else {
            this.showToast('Failed to apply color palette', 'error');
        }
    }

    /**
     * Close modal
     */
    closeModal() {
        if (this.previewRestore) {
            this.previewRestore();
            this.previewRestore = null;
        }

        if (this.modal) {
            this.modal.remove();
            this.modal = null;
        }
    }

    /**
     * Add modal styles
     */
    addModalStyles() {
        if (document.getElementById('autoColorModalStyles')) return;

        const styles = document.createElement('style');
        styles.id = 'autoColorModalStyles';
        styles.textContent = `
            .auto-color-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            }
            
            .color-modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(4px);
            }
            
            .color-modal-container {
                position: relative;
                background: white;
                border-radius: 16px;
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
                max-width: 700px;
                width: 90%;
                max-height: 90vh;
                overflow-y: auto;
                animation: modalSlideIn 0.3s ease;
            }
            
            @keyframes modalSlideIn {
                from {
                    opacity: 0;
                    transform: translateY(20px) scale(0.95);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }
            
            .color-modal-header {
                padding: 24px;
                border-bottom: 1px solid #e5e7eb;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .color-modal-header h3 {
                margin: 0;
                font-size: 20px;
                font-weight: 700;
                color: #1f2937;
            }
            
            .color-modal-close {
                background: none;
                border: none;
                font-size: 24px;
                color: #6b7280;
                cursor: pointer;
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 6px;
                transition: all 0.2s;
            }
            
            .color-modal-close:hover {
                background: #f3f4f6;
                color: #374151;
            }
            
            .color-modal-body {
                padding: 24px;
            }
            
            .option-tabs {
                display: flex;
                gap: 8px;
                margin-bottom: 24px;
                border-bottom: 1px solid #e5e7eb;
            }
            
            .tab-btn {
                padding: 12px 20px;
                background: none;
                border: none;
                border-bottom: 2px solid transparent;
                font-size: 14px;
                font-weight: 500;
                color: #6b7280;
                cursor: pointer;
                transition: all 0.2s;
            }
            
            .tab-btn.active {
                color: #3b82f6;
                border-bottom-color: #3b82f6;
            }
            
            .tab-btn:hover {
                color: #374151;
            }
            
            .tab-content {
                display: none;
            }
            
            .tab-content.active {
                display: block;
            }
            
            .upload-area {
                border: 2px dashed #d1d5db;
                border-radius: 12px;
                padding: 48px;
                text-align: center;
                transition: all 0.2s;
            }
            
            .upload-area:hover {
                border-color: #3b82f6;
                background: #f8fafc;
            }
            
            .upload-placeholder {
                cursor: pointer;
            }
            
            .upload-placeholder svg {
                color: #9ca3af;
                margin-bottom: 16px;
            }
            
            .upload-placeholder p {
                margin: 0 0 8px 0;
                font-size: 16px;
                font-weight: 500;
                color: #374151;
            }
            
            .upload-placeholder small {
                color: #6b7280;
            }
            
            .upload-success, .upload-error {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 8px;
            }
            
            .upload-success svg {
                color: #10b981;
            }
            
            .upload-error svg {
                color: #ef4444;
            }
            
            .theme-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 16px;
            }
            
            .theme-card {
                border: 2px solid #e5e7eb;
                border-radius: 12px;
                padding: 16px;
                cursor: pointer;
                transition: all 0.2s;
                text-align: center;
            }
            
            .theme-card:hover {
                border-color: #3b82f6;
                transform: translateY(-2px);
            }
            
            .theme-card.selected {
                border-color: #3b82f6;
                background: #f0f9ff;
            }
            
            .theme-preview {
                display: flex;
                gap: 4px;
                margin-bottom: 12px;
                justify-content: center;
            }
            
            .color-swatch {
                width: 24px;
                height: 24px;
                border-radius: 4px;
                border: 1px solid #e5e7eb;
            }
            
            .color-swatch.large {
                width: 32px;
                height: 32px;
            }
            
            .theme-name {
                font-size: 14px;
                font-weight: 500;
                color: #374151;
            }
            
            .generate-btn {
                width: 100%;
                padding: 14px 20px;
                background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                color: white;
                border: none;
                border-radius: 8px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
                margin: 24px 0;
            }
            
            .generate-btn:hover:not(:disabled) {
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
            }
            
            .generate-btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
            
            .loading-state {
                text-align: center;
                padding: 40px;
            }
            
            .loading-spinner {
                width: 40px;
                height: 40px;
                border: 3px solid #f3f3f3;
                border-top: 3px solid #3b82f6;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 16px;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            .palette-result h4 {
                margin: 0 0 16px 0;
                font-size: 18px;
                font-weight: 600;
                color: #1f2937;
            }
            
            .palette-colors {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
                gap: 16px;
                margin-bottom: 24px;
            }
            
            .color-card {
                text-align: center;
            }
            
            .color-info {
                margin-top: 8px;
            }
            
            .color-label {
                font-size: 12px;
                font-weight: 500;
                color: #6b7280;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            
            .color-value {
                font-size: 11px;
                color: #374151;
                font-family: monospace;
                margin-top: 2px;
            }
            
            .palette-actions {
                display: flex;
                gap: 12px;
            }
            
            .preview-btn, .apply-btn {
                flex: 1;
                padding: 12px 20px;
                border: none;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
            }
            
            .preview-btn {
                background: #f3f4f6;
                color: #374151;
            }
            
            .preview-btn:hover {
                background: #e5e7eb;
            }
            
            .apply-btn {
                background: #10b981;
                color: white;
            }
            
            .apply-btn:hover {
                background: #059669;
                transform: translateY(-1px);
            }
        `;
        
        document.head.appendChild(styles);
    }

    /**
     * Show toast notification
     */
    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `color-toast ${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-message">${message}</span>
                <button class="toast-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;

        if (!document.getElementById('colorToastStyles')) {
            const styles = document.createElement('style');
            styles.id = 'colorToastStyles';
            styles.textContent = `
                .color-toast {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    z-index: 10001;
                    animation: slideInRight 0.3s ease;
                    max-width: 300px;
                }
                .color-toast.success {
                    border-left: 4px solid #10b981;
                }
                .color-toast.error {
                    border-left: 4px solid #ef4444;
                }
                .toast-content {
                    padding: 12px 16px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .toast-message {
                    flex: 1;
                    font-size: 14px;
                    color: #1f2937;
                }
                .toast-close {
                    background: none;
                    border: none;
                    font-size: 18px;
                    color: #6b7280;
                    cursor: pointer;
                    padding: 0;
                    width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .toast-close:hover {
                    color: #374151;
                }
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(styles);
        }

        document.body.appendChild(toast);

        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 3000);
    }
}

// Create global instance
window.autoColorPalette = new AutoColorPalette();
window.autoColorUI = new AutoColorPaletteUI();
