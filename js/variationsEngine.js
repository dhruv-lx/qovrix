/**
 * Variations Engine - One Click Design Variations
 * Generates multiple design variations from a single poster
 * Strict modular architecture - no core logic modifications
 */

class VariationsEngine {
    constructor() {
        this.colorPalettes = [
            {
                name: 'Ocean Breeze',
                background: '#e0f2fe',
                text: '#0c4a6e',
                accent: '#0284c7',
                secondary: '#7dd3fc'
            },
            {
                name: 'Sunset Glow',
                background: '#fef3c7',
                text: '#78350f',
                accent: '#f59e0b',
                secondary: '#fcd34d'
            },
            {
                name: 'Forest Green',
                background: '#dcfce7',
                text: '#14532d',
                accent: '#16a34a',
                secondary: '#86efac'
            },
            {
                name: 'Royal Purple',
                background: '#f3e8ff',
                text: '#4c1d95',
                accent: '#7c3aed',
                secondary: '#c4b5fd'
            },
            {
                name: 'Ruby Red',
                background: '#fee2e2',
                text: '#7f1d1d',
                accent: '#dc2626',
                secondary: '#fca5a5'
            },
            {
                name: 'Midnight Dark',
                background: '#1e293b',
                text: '#f1f5f9',
                accent: '#3b82f6',
                secondary: '#64748b'
            }
        ];

        this.fontPairs = [
            {
                name: 'Modern Sans',
                heading: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                body: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
            },
            {
                name: 'Classic Serif',
                heading: 'Georgia, serif',
                body: 'Georgia, serif'
            },
            {
                name: 'Tech Mono',
                heading: 'JetBrains Mono, monospace',
                body: 'JetBrains Mono, monospace'
            },
            {
                name: 'Elegant Script',
                heading: 'Playfair Display, serif',
                body: 'Source Sans Pro, sans-serif'
            },
            {
                name: 'Bold Impact',
                heading: 'Montserrat, sans-serif',
                body: 'Open Sans, sans-serif'
            },
            {
                name: 'Minimal Clean',
                heading: 'Poppins, sans-serif',
                body: 'Roboto, sans-serif'
            }
        ];

        this.layoutPresets = [
            {
                name: 'Centered Focus',
                alignment: 'center',
                spacing: 1.2,
                verticalOffset: 0
            },
            {
                name: 'Left Aligned',
                alignment: 'left',
                spacing: 1.0,
                verticalOffset: -50
            },
            {
                name: 'Right Aligned',
                alignment: 'right',
                spacing: 1.0,
                verticalOffset: -50
            },
            {
                name: 'Top Heavy',
                alignment: 'center',
                spacing: 0.8,
                verticalOffset: -100
            },
            {
                name: 'Bottom Heavy',
                alignment: 'center',
                spacing: 1.5,
                verticalOffset: 100
            },
            {
                name: 'Scattered',
                alignment: 'center',
                spacing: 1.3,
                verticalOffset: 0,
                randomOffset: true
            }
        ];
    }

    /**
     * Capture current poster state
     */
    capturePosterState() {
        const editor = window.editor;
        if (!editor) {
            console.error('Variations Engine: Editor not found');
            return null;
        }

        console.log('Capturing poster state from editor type:', editor.constructor.name);

        // Get canvas dimensions - works for both editors
        let width = 800;
        let height = 1000;
        
        if (editor.canvas) {
            if (editor.canvas.style) {
                width = parseInt(editor.canvas.style.width) || width;
                height = parseInt(editor.canvas.style.height) || height;
            }
            if (editor.canvas.width) {
                width = editor.canvas.width || width;
            }
            if (editor.canvas.height) {
                height = editor.canvas.height || height;
            }
        }

        // Get background color
        let backgroundColor = '#ffffff';
        if (editor.backgroundColor) {
            backgroundColor = editor.backgroundColor;
        } else if (editor.canvas && editor.canvas.style) {
            backgroundColor = editor.canvas.style.backgroundColor || editor.canvas.style.background || '#ffffff';
        }

        return {
            elements: JSON.parse(JSON.stringify(editor.elements || [])),
            backgroundColor: backgroundColor,
            width: width,
            height: height
        };
    }

    /**
     * Clone poster state for variation
     */
    clonePosterState(originalState) {
        return JSON.parse(JSON.stringify(originalState));
    }

    /**
     * Apply color variation
     */
    applyColorVariation(posterState, palette, intensity = 'medium') {
        const variation = this.clonePosterState(posterState);
        
        // Background color
        if (intensity === 'high') {
            variation.backgroundColor = palette.background;
        } else if (intensity === 'medium') {
            variation.backgroundColor = this.blendColors(posterState.backgroundColor, palette.background, 0.7);
        } else {
            variation.backgroundColor = this.blendColors(posterState.backgroundColor, palette.background, 0.3);
        }

        // Text colors
        variation.elements.forEach(element => {
            if (element.type === 'text') {
                // Handle both color and textColor properties (admin vs user editor)
                const currentColor = element.color || element.textColor || '#000000';
                
                if (intensity === 'high') {
                    element.color = palette.text;
                    element.textColor = palette.text; // For admin editor
                } else if (intensity === 'medium') {
                    const newColor = this.blendColors(currentColor, palette.text, 0.7);
                    element.color = newColor;
                    element.textColor = newColor; // For admin editor
                } else {
                    const newColor = this.blendColors(currentColor, palette.text, 0.3);
                    element.color = newColor;
                    element.textColor = newColor; // For admin editor
                }
            }
            
            // Shape colors
            if (element.type === 'shape') {
                const currentBgColor = element.backgroundColor || element.bgColor || '#cccccc';
                
                if (intensity === 'high') {
                    element.backgroundColor = palette.accent;
                    element.bgColor = palette.accent; // For admin editor
                } else if (intensity === 'medium') {
                    const newColor = this.blendColors(currentBgColor, palette.accent, 0.6);
                    element.backgroundColor = newColor;
                    element.bgColor = newColor; // For admin editor
                } else {
                    const newColor = this.blendColors(currentBgColor, palette.accent, 0.3);
                    element.backgroundColor = newColor;
                    element.bgColor = newColor; // For admin editor
                }
            }
        });

        return variation;
    }

    /**
     * Apply font variation
     */
    applyFontVariation(posterState, fontPair, intensity = 'medium') {
        const variation = this.clonePosterState(posterState);

        variation.elements.forEach(element => {
            if (element.type === 'text') {
                const fontSize = element.fontSize || element.size || 16;
                
                if (intensity === 'high') {
                    // Apply both heading and body fonts based on size
                    if (fontSize > 24) {
                        element.fontFamily = fontPair.heading;
                        element.font = fontPair.heading; // For admin editor
                    } else {
                        element.fontFamily = fontPair.body;
                        element.font = fontPair.body; // For admin editor
                    }
                } else if (intensity === 'medium') {
                    // Only apply to larger text
                    if (fontSize > 32) {
                        element.fontFamily = fontPair.heading;
                        element.font = fontPair.heading; // For admin editor
                    }
                }
                // Low intensity - no font change
            }
        });

        return variation;
    }

    /**
     * Apply layout variation
     */
    applyLayoutVariation(posterState, layoutPreset, intensity = 'medium') {
        const variation = this.clonePosterState(posterState);

        const centerX = posterState.width / 2;
        const centerY = posterState.height / 2;

        variation.elements.forEach((element, index) => {
            const originalX = element.x || 0;
            const originalY = element.y || 0;
            const elementWidth = element.width || 100;
            const elementHeight = element.height || 50;

            // Apply alignment
            if (layoutPreset.alignment === 'center') {
                element.x = centerX - (elementWidth / 2);
            } else if (layoutPreset.alignment === 'left') {
                element.x = 50 + (index * 20);
            } else if (layoutPreset.alignment === 'right') {
                element.x = posterState.width - elementWidth - 50 - (index * 20);
            }

            // Apply spacing
            if (index > 0) {
                const prevElement = variation.elements[index - 1];
                if (prevElement) {
                    const prevHeight = prevElement.height || 50;
                    element.y = prevElement.y + prevHeight + (20 * layoutPreset.spacing);
                }
            }

            // Apply vertical offset
            element.y += layoutPreset.verticalOffset;

            // Random offset for scattered layout
            if (layoutPreset.randomOffset && intensity === 'high') {
                element.x += (Math.random() - 0.5) * 100;
                element.y += (Math.random() - 0.5) * 50;
            }

            // Intensity-based adjustments
            if (intensity === 'low') {
                // Minimal changes - blend with original
                element.x = originalX * 0.7 + element.x * 0.3;
                element.y = originalY * 0.7 + element.y * 0.3;
            } else if (intensity === 'medium') {
                // Medium changes
                element.x = originalX * 0.3 + element.x * 0.7;
                element.y = originalY * 0.3 + element.y * 0.7;
            }
            // High intensity - full changes applied
        });

        return variation;
    }

    /**
     * Generate multiple variations
     */
    generateVariations(options = {}) {
        const posterState = this.capturePosterState();
        if (!posterState) return [];

        const {
            count = 6,
            colorVariations = true,
            fontVariations = true,
            layoutVariations = true,
            intensity = 'medium'
        } = options;

        const variations = [];

        for (let i = 0; i < count; i++) {
            let variation = posterState;
            const variationName = [];

            // Apply color variation
            if (colorVariations && Math.random() > 0.3) {
                const palette = this.colorPalettes[i % this.colorPalettes.length];
                variation = this.applyColorVariation(variation, palette, intensity);
                variationName.push(palette.name);
            }

            // Apply font variation
            if (fontVariations && Math.random() > 0.5) {
                const fontPair = this.fontPairs[i % this.fontPairs.length];
                variation = this.applyFontVariation(variation, fontPair, intensity);
                variationName.push(fontPair.name);
            }

            // Apply layout variation
            if (layoutVariations && Math.random() > 0.4) {
                const layoutPreset = this.layoutPresets[i % this.layoutPresets.length];
                variation = this.applyLayoutVariation(variation, layoutPreset, intensity);
                variationName.push(layoutPreset.name);
            }

            // Create final variation object
            variations.push({
                id: `variation_${Date.now()}_${i}`,
                name: variationName.length > 0 ? variationName.join(' + ') : 'Original Style',
                elements: variation.elements,
                backgroundColor: variation.backgroundColor,
                width: variation.width,
                height: variation.height,
                thumbnail: null
            });
        }

        return variations;
    }

    /**
     * Create canvas for variation preview
     */
    createVariationCanvas(variation, scale = 0.3) {
        const canvas = document.createElement('canvas');
        const width = variation.width * scale;
        const height = variation.height * scale;
        
        canvas.width = width;
        canvas.height = height;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        
        const ctx = canvas.getContext('2d');
        
        // Background
        ctx.fillStyle = variation.backgroundColor;
        ctx.fillRect(0, 0, width, height);
        
        // Scale context for preview
        ctx.scale(scale, scale);
        
        // Render elements
        variation.elements.forEach(element => {
            this.renderElementToCanvas(ctx, element);
        });
        
        return canvas;
    }

    /**
     * Render element to canvas (simplified version)
     */
    renderElementToCanvas(ctx, element) {
        ctx.save();
        
        switch (element.type) {
            case 'text':
                const fontSize = element.fontSize || element.size || 16;
                const fontFamily = element.fontFamily || element.font || 'Arial';
                const fontWeight = element.fontWeight || 'normal';
                const color = element.color || element.textColor || '#000000';
                const text = element.text || '';
                
                ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
                ctx.fillStyle = color;
                ctx.fillText(text, element.x || 0, (element.y || 0) + fontSize);
                break;
                
            case 'shape':
                const bgColor = element.backgroundColor || element.bgColor || '#cccccc';
                const x = element.x || 0;
                const y = element.y || 0;
                const width = element.width || 100;
                const height = element.height || 50;
                
                ctx.fillStyle = bgColor;
                ctx.fillRect(x, y, width, height);
                break;
                
            case 'image':
                const imgX = element.x || 0;
                const imgY = element.y || 0;
                const imgWidth = element.width || 100;
                const imgHeight = element.height || 100;
                
                // For preview, show placeholder
                ctx.fillStyle = '#e0e0e0';
                ctx.fillRect(imgX, imgY, imgWidth, imgHeight);
                ctx.fillStyle = '#666666';
                ctx.font = '14px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('Image', imgX + imgWidth/2, imgY + imgHeight/2);
                break;
        }
        
        ctx.restore();
    }

    /**
     * Apply variation to editor
     */
    applyVariationToEditor(variation) {
        const editor = window.editor;
        if (!editor) {
            console.error('Variations Engine: Editor not found');
            return false;
        }

        console.log('Applying variation to editor type:', editor.constructor.name);

        // Clear selection first (if method exists)
        if (typeof editor.deselectAll === 'function') {
            editor.deselectAll();
        }
        
        // Apply new elements and background
        editor.elements = JSON.parse(JSON.stringify(variation.elements));
        editor.backgroundColor = variation.backgroundColor;
        
        // Update canvas background for user editor
        if (editor.canvas && editor.canvas.style) {
            editor.canvas.style.background = variation.backgroundColor;
        }
        
        // Save state for undo/redo (if method exists)
        if (typeof editor.saveState === 'function') {
            editor.saveState();
        }
        
        // Re-render the canvas
        if (typeof editor.render === 'function') {
            editor.render();
        } else if (typeof editor.renderCanvas === 'function') {
            // Admin editor uses renderCanvas
            editor.renderCanvas();
        }
        
        // Update property panel and layers (if methods exist)
        if (typeof editor.updatePropertyPanel === 'function') {
            editor.updatePropertyPanel();
        }
        if (typeof editor.updateLayersList === 'function') {
            editor.updateLayersList();
        }
        
        // Re-apply auto-scale to ensure canvas is centered (if method exists)
        if (typeof editor.fitToScreen === 'function') {
            setTimeout(() => editor.fitToScreen(), 100);
        }
        
        // For admin editor, update the canvas background directly
        if (editor.canvas && editor.canvas.style && !editor.canvas.style.background) {
            editor.canvas.style.backgroundColor = variation.backgroundColor;
        }
        
        console.log('Variation applied successfully:', variation.name);
        return true;
    }

    /**
     * Export variation as image
     */
    exportVariation(variation, filename = null) {
        const canvas = this.createVariationCanvas(variation, 1.0);
        const link = document.createElement('a');
        link.download = filename || `variation_${variation.name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    }

    /**
     * Blend two colors
     */
    blendColors(color1, color2, ratio) {
        const hex2rgb = (hex) => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : { r: 0, g: 0, b: 0 };
        };

        const rgb2hex = (r, g, b) => {
            return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        };

        const c1 = hex2rgb(color1);
        const c2 = hex2rgb(color2);

        const r = Math.round(c1.r * (1 - ratio) + c2.r * ratio);
        const g = Math.round(c1.g * (1 - ratio) + c2.g * ratio);
        const b = Math.round(c1.b * (1 - ratio) + c2.b * ratio);

        return rgb2hex(r, g, b);
    }
}

// UI Controller for Variations
class VariationsUI {
    constructor() {
        this.engine = new VariationsEngine();
        this.modal = null;
        this.variations = [];
        this.isOpen = false;
    }

    /**
     * Open variations modal
     */
    open(options = {}) {
        if (this.isOpen) return;
        
        this.createModal();
        this.isOpen = true;
        document.body.style.overflow = 'hidden';
        
        // Generate variations
        this.generateAndShow(options);
    }

    /**
     * Close modal
     */
    close() {
        if (!this.isOpen) return;
        
        if (this.modal) {
            this.modal.remove();
            this.modal = null;
        }
        
        this.isOpen = false;
        document.body.style.overflow = '';
    }

    /**
     * Create modal HTML
     */
    createModal() {
        const modal = document.createElement('div');
        modal.id = 'variationsModal';
        modal.className = 'variations-modal';
        modal.innerHTML = `
            <div class="variations-overlay" onclick="variationsUI.close()"></div>
            <div class="variations-container">
                <div class="variations-header">
                    <h2>🎨 Design Variations</h2>
                    <p>Generate multiple design variations instantly</p>
                    <button class="variations-close" onclick="variationsUI.close()">&times;</button>
                </div>
                
                <div class="variations-controls">
                    <div class="control-group">
                        <label>Variation Type:</label>
                        <div class="checkbox-group">
                            <label><input type="checkbox" id="colorVariations" checked> Colors</label>
                            <label><input type="checkbox" id="fontVariations" checked> Fonts</label>
                            <label><input type="checkbox" id="layoutVariations" checked> Layout</label>
                        </div>
                    </div>
                    <div class="control-group">
                        <label>Intensity:</label>
                        <select id="intensity">
                            <option value="low">Low</option>
                            <option value="medium" selected>Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                    <button class="generate-btn" onclick="variationsUI.regenerate()">
                        ✨ Generate Variations
                    </button>
                </div>
                
                <div class="variations-loading" id="variationsLoading" style="display: none;">
                    <div class="loading-spinner"></div>
                    <p>Generating variations...</p>
                </div>
                
                <div class="variations-preview" id="variationsPreview">
                    <div class="preview-grid" id="previewGrid"></div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.modal = modal;
        this.addStyles();
    }

    /**
     * Add CSS styles
     */
    addStyles() {
        if (document.getElementById('variationsStyles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'variationsStyles';
        styles.textContent = `
            .variations-modal {
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
            
            .variations-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.7);
                backdrop-filter: blur(8px);
            }
            
            .variations-container {
                position: relative;
                width: 90%;
                max-width: 1200px;
                max-height: 90vh;
                background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
                border-radius: 16px;
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                overflow: hidden;
                display: flex;
                flex-direction: column;
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
            
            .variations-header {
                padding: 20px 24px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                position: relative;
            }
            
            .variations-header h2 {
                color: white;
                font-size: 20px;
                font-weight: 700;
                margin: 0 0 4px 0;
            }
            
            .variations-header p {
                color: rgba(255, 255, 255, 0.6);
                font-size: 12px;
                margin: 0;
            }
            
            .variations-close {
                position: absolute;
                top: 16px;
                right: 20px;
                width: 32px;
                height: 32px;
                border: none;
                background: rgba(255, 255, 255, 0.1);
                color: white;
                font-size: 20px;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.2s;
            }
            
            .variations-close:hover {
                background: rgba(255, 255, 255, 0.2);
            }
            
            .variations-controls {
                padding: 16px 24px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                display: flex;
                gap: 24px;
                align-items: center;
                flex-wrap: wrap;
            }
            
            .control-group {
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .control-group label {
                color: rgba(255, 255, 255, 0.8);
                font-size: 14px;
                font-weight: 500;
            }
            
            .checkbox-group {
                display: flex;
                gap: 12px;
            }
            
            .checkbox-group label {
                display: flex;
                align-items: center;
                gap: 4px;
                cursor: pointer;
            }
            
            .checkbox-group input[type="checkbox"] {
                margin: 0;
            }
            
            .control-group select {
                padding: 6px 12px;
                border: 1px solid rgba(255, 255, 255, 0.2);
                background: rgba(255, 255, 255, 0.1);
                color: white;
                border-radius: 6px;
                font-size: 14px;
            }
            
            .generate-btn {
                padding: 8px 20px;
                background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
                color: white;
                border: none;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
            }
            
            .generate-btn:hover {
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
            }
            
            .variations-loading {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(15, 23, 42, 0.9);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                color: white;
            }
            
            .loading-spinner {
                width: 40px;
                height: 40px;
                border: 3px solid rgba(255, 255, 255, 0.1);
                border-top-color: #6366f1;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin-bottom: 16px;
            }
            
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
            
            .variations-preview {
                flex: 1;
                overflow-y: auto;
                padding: 20px 24px;
            }
            
            .preview-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                gap: 20px;
            }
            
            .preview-item {
                background: rgba(255, 255, 255, 0.05);
                border-radius: 12px;
                padding: 16px;
                text-align: center;
                transition: all 0.2s;
                cursor: pointer;
            }
            
            .preview-item:hover {
                background: rgba(255, 255, 255, 0.1);
                transform: translateY(-2px);
            }
            
            .preview-canvas-wrapper {
                background: white;
                border-radius: 8px;
                overflow: hidden;
                margin-bottom: 12px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                min-height: 200px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .preview-name {
                color: white;
                font-weight: 600;
                font-size: 14px;
                margin-bottom: 4px;
            }
            
            .preview-actions {
                display: flex;
                gap: 8px;
                justify-content: center;
            }
            
            .preview-btn {
                padding: 6px 12px;
                font-size: 12px;
                font-weight: 600;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                transition: all 0.2s;
            }
            
            .preview-btn.apply {
                background: #3b82f6;
                color: white;
            }
            
            .preview-btn.apply:hover {
                background: #2563eb;
            }
            
            .preview-btn.download {
                background: #10b981;
                color: white;
            }
            
            .preview-btn.download:hover {
                background: #059669;
            }
        `;
        
        document.head.appendChild(styles);
    }

    /**
     * Generate and show variations
     */
    async generateAndShow(options = {}) {
        const loadingEl = document.getElementById('variationsLoading');
        const previewEl = document.getElementById('variationsPreview');
        const previewGrid = document.getElementById('previewGrid');
        
        // Get control values
        const colorVariations = document.getElementById('colorVariations')?.checked ?? true;
        const fontVariations = document.getElementById('fontVariations')?.checked ?? true;
        const layoutVariations = document.getElementById('layoutVariations')?.checked ?? true;
        const intensity = document.getElementById('intensity')?.value ?? 'medium';
        
        // Show loading
        loadingEl.style.display = 'flex';
        
        // Small delay for UI
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Generate variations
        this.variations = this.engine.generateVariations({
            count: 6,
            colorVariations,
            fontVariations,
            layoutVariations,
            intensity,
            ...options
        });
        
        // Render previews
        previewGrid.innerHTML = '';
        this.variations.forEach((variation, index) => {
            const canvas = this.engine.createVariationCanvas(variation);
            
            const previewItem = document.createElement('div');
            previewItem.className = 'preview-item';
            previewItem.innerHTML = `
                <div class="preview-canvas-wrapper"></div>
                <div class="preview-name">${variation.name}</div>
                <div class="preview-actions">
                    <button class="preview-btn apply" onclick="variationsUI.applyVariation('${variation.id}')">
                        ✓ Apply
                    </button>
                    <button class="preview-btn download" onclick="variationsUI.downloadVariation('${variation.id}')">
                        ⬇️ Download
                    </button>
                </div>
            `;
            
            previewItem.querySelector('.preview-canvas-wrapper').appendChild(canvas);
            previewGrid.appendChild(previewItem);
        });
        
        // Hide loading, show preview
        loadingEl.style.display = 'none';
        previewEl.style.display = 'block';
    }

    /**
     * Regenerate variations
     */
    regenerate() {
        this.generateAndShow();
    }

    /**
     * Apply variation to editor
     */
    applyVariation(variationId) {
        console.log('Applying variation with ID:', variationId);
        console.log('Available variations:', this.variations);
        
        const variation = this.variations.find(v => v.id === variationId);
        if (variation) {
            console.log('Found variation:', variation);
            if (confirm(`Apply "${variation.name}" to the editor? This will replace your current poster.`)) {
                console.log('User confirmed, applying variation...');
                const success = this.engine.applyVariationToEditor(variation);
                if (success) {
                    console.log('Variation applied successfully, closing modal...');
                    this.close();
                } else {
                    console.error('Failed to apply variation');
                    alert('Failed to apply variation. Please try again.');
                }
            }
        } else {
            console.error('Variation not found with ID:', variationId);
            alert('Variation not found. Please regenerate variations.');
        }
    }

    /**
     * Download variation
     */
    downloadVariation(variationId) {
        const variation = this.variations.find(v => v.id === variationId);
        if (variation) {
            this.engine.exportVariation(variation);
        }
    }
}

// Create global instances
window.variationsEngine = new VariationsEngine();
window.variationsUI = new VariationsUI();
