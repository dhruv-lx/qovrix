/**
 * Brand Kit Manager - Save and Reuse Brand Identity
 * Modular architecture - completely isolated from core logic
 */

class BrandKitManager {
    constructor() {
        this.currentKit = null;
        this.kits = [];
        this.storageKey = 'posterBrandKits';
        this.currentKitKey = 'posterCurrentBrandKit';
        
        // Default fonts available
        this.availableFonts = [
            { name: 'Inter', value: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' },
            { name: 'Poppins', value: 'Poppins, sans-serif' },
            { name: 'Roboto', value: 'Roboto, sans-serif' },
            { name: 'Montserrat', value: 'Montserrat, sans-serif' },
            { name: 'Playfair Display', value: 'Playfair Display, serif' },
            { name: 'Georgia', value: 'Georgia, serif' },
            { name: 'Open Sans', value: 'Open Sans, sans-serif' },
            { name: 'Source Sans Pro', value: 'Source Sans Pro, sans-serif' },
            { name: 'JetBrains Mono', value: 'JetBrains Mono, monospace' },
            { name: 'Space Grotesk', value: 'Space Grotesk, sans-serif' }
        ];
        
        this.loadKits();
        this.loadCurrentKit();
    }

    /**
     * Load all brand kits from localStorage
     */
    loadKits() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            this.kits = stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Failed to load brand kits:', error);
            this.kits = [];
        }
    }

    /**
     * Save all brand kits to localStorage
     */
    saveKits() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.kits));
            return true;
        } catch (error) {
            console.error('Failed to save brand kits:', error);
            return false;
        }
    }

    /**
     * Load current brand kit
     */
    loadCurrentKit() {
        try {
            const stored = localStorage.getItem(this.currentKitKey);
            this.currentKit = stored ? JSON.parse(stored) : null;
        } catch (error) {
            console.error('Failed to load current brand kit:', error);
            this.currentKit = null;
        }
    }

    /**
     * Save current brand kit
     */
    saveCurrentKit() {
        try {
            localStorage.setItem(this.currentKitKey, JSON.stringify(this.currentKit));
            return true;
        } catch (error) {
            console.error('Failed to save current brand kit:', error);
            return false;
        }
    }

    /**
     * Create a new brand kit
     */
    createBrandKit(name, data = {}) {
        const kit = {
            id: `brand_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: name || 'Untitled Brand',
            logo: data.logo || null,
            colors: data.colors || ['#3b82f6', '#10b981', '#f59e0b'],
            fonts: {
                heading: data.fonts?.heading || 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                body: data.fonts?.body || 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.kits.push(kit);
        this.saveKits();
        return kit;
    }

    /**
     * Update existing brand kit
     */
    updateBrandKit(id, data) {
        const kitIndex = this.kits.findIndex(k => k.id === id);
        if (kitIndex === -1) return false;

        this.kits[kitIndex] = {
            ...this.kits[kitIndex],
            ...data,
            updatedAt: new Date().toISOString()
        };

        this.saveKits();
        return true;
    }

    /**
     * Delete brand kit
     */
    deleteBrandKit(id) {
        const kitIndex = this.kits.findIndex(k => k.id === id);
        if (kitIndex === -1) return false;

        this.kits.splice(kitIndex, 1);
        this.saveKits();

        // Clear current kit if it was deleted
        if (this.currentKit?.id === id) {
            this.currentKit = null;
            this.saveCurrentKit();
        }

        return true;
    }

    /**
     * Set current brand kit
     */
    setCurrentKit(id) {
        const kit = this.kits.find(k => k.id === id);
        if (!kit) return false;

        this.currentKit = kit;
        this.saveCurrentKit();
        return true;
    }

    /**
     * Get current brand kit
     */
    getCurrentKit() {
        return this.currentKit;
    }

    /**
     * Get all brand kits
     */
    getAllKits() {
        return this.kits;
    }

    /**
     * Apply brand kit to current poster
     */
    applyBrandKit(kitId = null) {
        const kit = kitId ? this.kits.find(k => k.id === kitId) : this.currentKit;
        if (!kit) {
            console.error('No brand kit to apply');
            return false;
        }

        const editor = window.editor;
        if (!editor) {
            console.error('Editor not found');
            return false;
        }

        // Save current state for undo
        if (typeof editor.saveState === 'function') {
            editor.saveState();
        }

        // Apply logo
        if (kit.logo) {
            this.applyLogo(kit.logo);
        }

        // Apply colors
        if (kit.colors && kit.colors.length > 0) {
            this.applyColors(kit.colors);
        }

        // Apply fonts
        if (kit.fonts) {
            this.applyFonts(kit.fonts);
        }

        // Re-render and update UI
        editor.render();
        if (typeof editor.updatePropertyPanel === 'function') {
            editor.updatePropertyPanel();
        }
        if (typeof editor.updateLayersList === 'function') {
            editor.updateLayersList();
        }

        // Show success message
        this.showToast('Brand applied successfully! 🎉', 'success');

        return true;
    }

    /**
     * Apply logo to poster
     */
    applyLogo(logoUrl) {
        const editor = window.editor;
        if (!editor) return;

        // Remove existing logo elements
        const existingLogos = editor.elements.filter(el => el.isBrandLogo);
        existingLogos.forEach(logo => {
            const index = editor.elements.indexOf(logo);
            if (index > -1) {
                editor.elements.splice(index, 1);
            }
        });

        // Add new logo
        const logoElement = {
            id: `brand_logo_${Date.now()}`,
            type: 'image',
            src: logoUrl,
            x: 50,
            y: 50,
            width: 150,
            height: 150,
            isBrandLogo: true,
            locked: false
        };

        editor.elements.unshift(logoElement); // Add to beginning
    }

    /**
     * Apply brand colors
     */
    applyColors(colors) {
        const editor = window.editor;
        if (!editor) return;

        // Set background to primary color
        if (colors[0]) {
            editor.backgroundColor = colors[0];
            if (editor.canvas) {
                editor.canvas.style.background = colors[0];
            }
        }

        // Apply colors to text elements
        let colorIndex = 1;
        editor.elements.forEach(element => {
            if (element.type === 'text') {
                // Cycle through brand colors for text
                element.color = colors[colorIndex % colors.length];
                colorIndex++;
            } else if (element.type === 'shape') {
                // Apply accent color to shapes
                if (colors[2]) {
                    element.backgroundColor = colors[2];
                }
            }
        });
    }

    /**
     * Apply brand fonts
     */
    applyFonts(fonts) {
        const editor = window.editor;
        if (!editor) return;

        editor.elements.forEach(element => {
            if (element.type === 'text') {
                // Apply heading font to larger text, body font to smaller
                if (element.fontSize && element.fontSize > 24) {
                    element.fontFamily = fonts.heading;
                } else {
                    element.fontFamily = fonts.body;
                }
            }
        });
    }

    /**
     * Handle logo upload
     */
    handleLogoUpload(file, kitId = null) {
        return new Promise((resolve, reject) => {
            if (!file || !file.type.startsWith('image/')) {
                reject(new Error('Please select an image file'));
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const logoUrl = e.target.result;
                
                if (kitId) {
                    // Update specific kit
                    const success = this.updateBrandKit(kitId, { logo: logoUrl });
                    if (success) {
                        resolve(logoUrl);
                    } else {
                        reject(new Error('Failed to update brand kit'));
                    }
                } else if (this.currentKit) {
                    // Update current kit
                    const success = this.updateBrandKit(this.currentKit.id, { logo: logoUrl });
                    if (success) {
                        this.currentKit.logo = logoUrl;
                        resolve(logoUrl);
                    } else {
                        reject(new Error('Failed to update brand kit'));
                    }
                } else {
                    // Create new kit with logo
                    const kit = this.createBrandKit('My Brand', { logo: logoUrl });
                    this.currentKit = kit;
                    this.saveCurrentKit();
                    resolve(logoUrl);
                }
            };

            reader.onerror = () => reject(new Error('Failed to read image file'));
            reader.readAsDataURL(file);
        });
    }

    /**
     * Show toast notification
     */
    showToast(message, type = 'success') {
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `brand-toast ${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-message">${message}</span>
                <button class="toast-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;

        // Add styles if not already added
        if (!document.getElementById('brandToastStyles')) {
            const styles = document.createElement('style');
            styles.id = 'brandToastStyles';
            styles.textContent = `
                .brand-toast {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    z-index: 10000;
                    animation: slideInRight 0.3s ease;
                    max-width: 300px;
                }
                .brand-toast.success {
                    border-left: 4px solid #10b981;
                }
                .brand-toast.error {
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

        // Auto remove after 3 seconds
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 3000);
    }
}

// UI Controller for Brand Kit
class BrandKitUI {
    constructor() {
        this.manager = new BrandKitManager();
        this.modal = null;
        this.currentView = 'user'; // 'user' or 'admin'
    }

    /**
     * Initialize user editor brand kit section
     */
    initUserEditor() {
        this.createUserBrandSection();
        this.currentView = 'user';
    }

    /**
     * Initialize admin editor brand kit panel
     */
    initAdminEditor() {
        this.createAdminBrandPanel();
        this.currentView = 'admin';
    }

    /**
     * Create brand kit section for user editor
     */
    createUserBrandSection() {
        const leftPanel = document.querySelector('.left-panel');
        if (!leftPanel) return;

        // Create brand kit section
        const brandSection = document.createElement('div');
        brandSection.className = 'elements-section';
        brandSection.innerHTML = `
            <div class="panel-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                    <path d="M12 8v4"/>
                    <circle cx="12" cy="16" r="1"/>
                </svg>
                Brand Kit
            </div>
            <div id="userBrandContent">
                <div class="brand-current" id="currentBrandDisplay" style="display: none;">
                    <div class="brand-preview">
                        <div class="brand-logo-preview" id="brandLogoPreview"></div>
                        <div class="brand-colors-preview" id="brandColorsPreview"></div>
                        <div class="brand-fonts-preview" id="brandFontsPreview"></div>
                    </div>
                    <button class="element-btn" onclick="brandKitUI.applyCurrentBrand()">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                        </svg>
                        Apply Brand
                    </button>
                </div>
                <div class="brand-empty" id="brandEmptyState">
                    <p style="color: rgba(255,255,255,0.6); font-size: 12px; margin-bottom: 12px;">No brand kit set</p>
                    <button class="element-btn" onclick="brandKitUI.showCreateBrandModal()">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="12" y1="5" x2="12" y2="19"/>
                            <line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                        Create Brand Kit
                    </button>
                </div>
            </div>
        `;

        leftPanel.appendChild(brandSection);
        this.updateUserBrandDisplay();
    }

    /**
     * Create brand kit panel for admin editor
     */
    createAdminBrandPanel() {
        const rightPanel = document.querySelector('.right-panel');
        if (!rightPanel) return;

        // Create brand kit panel
        const brandPanel = document.createElement('div');
        brandPanel.className = 'panel-section';
        brandPanel.innerHTML = `
            <div class="panel-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                </svg>
                Brand Kits
            </div>
            <div id="adminBrandContent">
                <div class="brand-actions">
                    <button class="property-input" style="background: #3b82f6; color: white; border: none; margin-bottom: 12px;" onclick="brandKitUI.showCreateBrandModal()">
                        + Create New Brand Kit
                    </button>
                </div>
                <div id="brandKitsList"></div>
            </div>
        `;

        rightPanel.appendChild(brandPanel);
        this.updateAdminBrandList();
    }

    /**
     * Update user brand display
     */
    updateUserBrandDisplay() {
        const currentKit = this.manager.getCurrentKit();
        const currentDisplay = document.getElementById('currentBrandDisplay');
        const emptyState = document.getElementById('brandEmptyState');

        if (currentKit) {
            currentDisplay.style.display = 'block';
            emptyState.style.display = 'none';

            // Update logo preview
            const logoPreview = document.getElementById('brandLogoPreview');
            if (currentKit.logo) {
                logoPreview.innerHTML = `<img src="${currentKit.logo}" style="max-width: 60px; max-height: 60px; border-radius: 4px;">`;
            } else {
                logoPreview.innerHTML = '<div style="width: 60px; height: 60px; background: rgba(255,255,255,0.1); border-radius: 4px; display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.5); font-size: 10px;">No Logo</div>';
            }

            // Update colors preview
            const colorsPreview = document.getElementById('brandColorsPreview');
            colorsPreview.innerHTML = currentKit.colors.map(color => 
                `<div style="width: 20px; height: 20px; background: ${color}; border-radius: 3px; border: 1px solid rgba(255,255,255,0.2);"></div>`
            ).join('');

            // Update fonts preview
            const fontsPreview = document.getElementById('brandFontsPreview');
            const headingFont = this.manager.availableFonts.find(f => f.value === currentKit.fonts.heading)?.name || 'Custom';
            const bodyFont = this.manager.availableFonts.find(f => f.value === currentKit.fonts.body)?.name || 'Custom';
            fontsPreview.innerHTML = `
                <div style="font-size: 10px; color: rgba(255,255,255,0.6);">
                    <div>Heading: ${headingFont}</div>
                    <div>Body: ${bodyFont}</div>
                </div>
            `;
        } else {
            currentDisplay.style.display = 'none';
            emptyState.style.display = 'block';
        }
    }

    /**
     * Update admin brand list
     */
    updateAdminBrandList() {
        const kitsList = document.getElementById('brandKitsList');
        if (!kitsList) return;

        const kits = this.manager.getAllKits();
        const currentKit = this.manager.getCurrentKit();

        if (kits.length === 0) {
            kitsList.innerHTML = '<p style="color: #6b7280; font-size: 12px; text-align: center; padding: 20px;">No brand kits created yet</p>';
            return;
        }

        kitsList.innerHTML = kits.map(kit => `
            <div class="brand-kit-item" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 12px; margin-bottom: 8px; ${currentKit?.id === kit.id ? 'border-color: #3b82f6;' : ''}">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                    <div>
                        <div style="font-weight: 600; color: white; font-size: 14px;">${kit.name}</div>
                        ${currentKit?.id === kit.id ? '<div style="font-size: 10px; color: #3b82f6;">Current</div>' : ''}
                    </div>
                    <div style="display: flex; gap: 4px;">
                        <button onclick="brandKitUI.editBrandKit('${kit.id}')" style="background: none; border: none; color: #6b7280; cursor: pointer; padding: 2px;">✏️</button>
                        <button onclick="brandKitUI.deleteBrandKit('${kit.id}')" style="background: none; border: none; color: #6b7280; cursor: pointer; padding: 2px;">🗑️</button>
                    </div>
                </div>
                <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 8px;">
                    ${kit.logo ? '<div style="width: 24px; height: 24px; background: url(' + kit.logo + '); background-size: cover; border-radius: 2px;"></div>' : '<div style="width: 24px; height: 24px; background: rgba(255,255,255,0.1); border-radius: 2px;"></div>'}
                    <div style="display: flex; gap: 2px;">
                        ${kit.colors.map(color => `<div style="width: 16px; height: 16px; background: ${color}; border-radius: 2px;"></div>`).join('')}
                    </div>
                </div>
                <div style="display: flex; gap: 4px;">
                    <button onclick="brandKitUI.setAsCurrent('${kit.id}')" style="flex: 1; padding: 6px; background: rgba(59, 130, 246, 0.2); border: 1px solid #3b82f6; color: white; border-radius: 4px; font-size: 11px; cursor: pointer;">Set Current</button>
                    <button onclick="brandKitUI.applyBrand('${kit.id}')" style="flex: 1; padding: 6px; background: #10b981; border: none; color: white; border-radius: 4px; font-size: 11px; cursor: pointer;">Apply</button>
                </div>
            </div>
        `).join('');
    }

    /**
     * Show create/edit brand modal
     */
    showCreateBrandModal(kitId = null) {
        const kit = kitId ? this.manager.kits.find(k => k.id === kitId) : null;
        const isEdit = !!kit;

        // Create modal
        const modal = document.createElement('div');
        modal.id = 'brandKitModal';
        modal.className = 'brand-modal';
        modal.innerHTML = `
            <div class="brand-modal-overlay" onclick="brandKitUI.closeBrandModal()"></div>
            <div class="brand-modal-container">
                <div class="brand-modal-header">
                    <h3>${isEdit ? 'Edit' : 'Create'} Brand Kit</h3>
                    <button class="brand-modal-close" onclick="brandKitUI.closeBrandModal()">×</button>
                </div>
                <div class="brand-modal-body">
                    <div class="form-group">
                        <label>Brand Name</label>
                        <input type="text" id="brandName" class="brand-input" value="${kit?.name || ''}" placeholder="My Brand">
                    </div>
                    
                    <div class="form-group">
                        <label>Logo</label>
                        <div class="logo-upload-area" onclick="document.getElementById('logoFileInput').click()">
                            <div class="logo-preview" id="logoPreview">
                                ${kit?.logo ? `<img src="${kit.logo}" style="max-width: 100px; max-height: 100px;">` : '<div style="color: #6b7280;">Click to upload logo</div>'}
                            </div>
                            <input type="file" id="logoFileInput" accept="image/*" style="display: none;" onchange="brandKitUI.handleLogoSelect(event)">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>Brand Colors</label>
                        <div class="color-inputs" id="colorInputs">
                            ${[0,1,2,3,4].map(i => `
                                <div class="color-input-group">
                                    <input type="color" id="brandColor${i}" class="brand-color-input" value="${kit?.colors?.[i] || (i === 0 ? '#3b82f6' : i === 1 ? '#10b981' : i === 2 ? '#f59e0b' : '#6b7280')}">
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>Heading Font</label>
                        <select id="headingFont" class="brand-select">
                            ${this.manager.availableFonts.map(font => 
                                `<option value="${font.value}" ${kit?.fonts?.heading === font.value ? 'selected' : ''}>${font.name}</option>`
                            ).join('')}
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label>Body Font</label>
                        <select id="bodyFont" class="brand-select">
                            ${this.manager.availableFonts.map(font => 
                                `<option value="${font.value}" ${kit?.fonts?.body === font.value ? 'selected' : ''}>${font.name}</option>`
                            ).join('')}
                        </select>
                    </div>
                </div>
                <div class="brand-modal-footer">
                    <button class="brand-btn secondary" onclick="brandKitUI.closeBrandModal()">Cancel</button>
                    <button class="brand-btn primary" onclick="brandKitUI.saveBrandKit('${kitId || ''}')">${isEdit ? 'Update' : 'Create'}</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        this.addBrandModalStyles();
    }

    /**
     * Add brand modal styles
     */
    addBrandModalStyles() {
        if (document.getElementById('brandModalStyles')) return;

        const styles = document.createElement('style');
        styles.id = 'brandModalStyles';
        styles.textContent = `
            .brand-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: -apple-system, BlinkMacSystemFont, sans-serif;
            }
            .brand-modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(4px);
            }
            .brand-modal-container {
                position: relative;
                background: white;
                border-radius: 12px;
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
                max-width: 500px;
                width: 90%;
                max-height: 90vh;
                overflow-y: auto;
            }
            .brand-modal-header {
                padding: 20px;
                border-bottom: 1px solid #e5e7eb;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .brand-modal-header h3 {
                margin: 0;
                font-size: 18px;
                font-weight: 600;
                color: #1f2937;
            }
            .brand-modal-close {
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
                border-radius: 4px;
            }
            .brand-modal-close:hover {
                background: #f3f4f6;
            }
            .brand-modal-body {
                padding: 20px;
            }
            .form-group {
                margin-bottom: 20px;
            }
            .form-group label {
                display: block;
                margin-bottom: 6px;
                font-weight: 500;
                color: #374151;
                font-size: 14px;
            }
            .brand-input {
                width: 100%;
                padding: 10px 12px;
                border: 1px solid #d1d5db;
                border-radius: 6px;
                font-size: 14px;
            }
            .brand-input:focus {
                outline: none;
                border-color: #3b82f6;
                box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
            }
            .logo-upload-area {
                border: 2px dashed #d1d5db;
                border-radius: 6px;
                padding: 20px;
                text-align: center;
                cursor: pointer;
                transition: all 0.2s;
            }
            .logo-upload-area:hover {
                border-color: #3b82f6;
                background: #f8fafc;
            }
            .color-inputs {
                display: flex;
                gap: 8px;
                flex-wrap: wrap;
            }
            .color-input-group {
                display: flex;
                align-items: center;
                gap: 4px;
            }
            .brand-color-input {
                width: 40px;
                height: 40px;
                border: 1px solid #d1d5db;
                border-radius: 4px;
                cursor: pointer;
            }
            .brand-select {
                width: 100%;
                padding: 10px 12px;
                border: 1px solid #d1d5db;
                border-radius: 6px;
                font-size: 14px;
                background: white;
            }
            .brand-modal-footer {
                padding: 20px;
                border-top: 1px solid #e5e7eb;
                display: flex;
                gap: 12px;
                justify-content: flex-end;
            }
            .brand-btn {
                padding: 10px 20px;
                border-radius: 6px;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s;
            }
            .brand-btn.primary {
                background: #3b82f6;
                color: white;
                border: none;
            }
            .brand-btn.primary:hover {
                background: #2563eb;
            }
            .brand-btn.secondary {
                background: white;
                color: #6b7280;
                border: 1px solid #d1d5db;
            }
            .brand-btn.secondary:hover {
                background: #f9fafb;
            }
        `;
        document.head.appendChild(styles);
    }

    /**
     * Handle logo file selection
     */
    handleLogoSelect(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const preview = document.getElementById('logoPreview');
            preview.innerHTML = `<img src="${e.target.result}" style="max-width: 100px; max-height: 100px;">`;
        };
        reader.readAsDataURL(file);
    }

    /**
     * Save brand kit
     */
    async saveBrandKit(kitId) {
        const name = document.getElementById('brandName').value.trim();
        if (!name) {
            this.manager.showToast('Please enter a brand name', 'error');
            return;
        }

        // Get colors
        const colors = [];
        for (let i = 0; i < 5; i++) {
            const colorInput = document.getElementById(`brandColor${i}`);
            if (colorInput && colorInput.value) {
                colors.push(colorInput.value);
            }
        }

        // Get fonts
        const headingFont = document.getElementById('headingFont').value;
        const bodyFont = document.getElementById('bodyFont').value;

        // Get logo
        const logoPreview = document.querySelector('#logoPreview img');
        const logo = logoPreview ? logoPreview.src : null;

        const brandData = {
            name,
            logo,
            colors,
            fonts: {
                heading: headingFont,
                body: bodyFont
            }
        };

        try {
            if (kitId) {
                // Update existing kit
                const success = this.manager.updateBrandKit(kitId, brandData);
                if (!success) throw new Error('Failed to update brand kit');
            } else {
                // Create new kit
                const newKit = this.manager.createBrandKit(name, brandData);
                this.manager.setCurrentKit(newKit.id);
            }

            this.manager.showToast(`Brand kit ${kitId ? 'updated' : 'created'} successfully!`, 'success');
            this.closeBrandModal();
            
            // Update UI
            if (this.currentView === 'user') {
                this.updateUserBrandDisplay();
            } else {
                this.updateAdminBrandList();
            }
        } catch (error) {
            this.manager.showToast('Failed to save brand kit', 'error');
            console.error(error);
        }
    }

    /**
     * Close brand modal
     */
    closeBrandModal() {
        const modal = document.getElementById('brandKitModal');
        if (modal) {
            modal.remove();
        }
    }

    /**
     * Apply current brand
     */
    applyCurrentBrand() {
        this.manager.applyBrandKit();
    }

    /**
     * Apply specific brand
     */
    applyBrand(kitId) {
        this.manager.applyBrandKit(kitId);
    }

    /**
     * Set as current brand
     */
    setAsCurrent(kitId) {
        const success = this.manager.setCurrentKit(kitId);
        if (success) {
            this.manager.showToast('Brand set as current', 'success');
            this.updateAdminBrandList();
            if (this.currentView === 'user') {
                this.updateUserBrandDisplay();
            }
        }
    }

    /**
     * Edit brand kit
     */
    editBrandKit(kitId) {
        this.showCreateBrandModal(kitId);
    }

    /**
     * Delete brand kit
     */
    deleteBrandKit(kitId) {
        if (confirm('Are you sure you want to delete this brand kit?')) {
            const success = this.manager.deleteBrandKit(kitId);
            if (success) {
                this.manager.showToast('Brand kit deleted', 'success');
                this.updateAdminBrandList();
                if (this.currentView === 'user') {
                    this.updateUserBrandDisplay();
                }
            }
        }
    }
}

// Create global instances
window.brandKitManager = new BrandKitManager();
window.brandKitUI = new BrandKitUI();
