/**
 * Magic Resize - Smart Poster Resizing for Social Media
 * Creates multiple size variations of a poster without modifying the original
 */

class MagicResize {
    constructor() {
        this.originalCanvas = null;
        this.resizedVersions = [];
        this.isProcessing = false;
        
        // Target sizes for social media
        this.targetSizes = {
            instagramPost: { width: 1080, height: 1080, name: 'Instagram Post', aspect: '1:1' },
            instagramStory: { width: 1080, height: 1920, name: 'Instagram Story', aspect: '9:16' },
            poster: { width: 1080, height: 1350, name: 'Poster (4:5)', aspect: '4:5' },
            whatsappStatus: { width: 1080, height: 1920, name: 'WhatsApp Status', aspect: '9:16' }
        };
        
        // Original poster dimensions (from user-editor)
        this.originalSize = { width: 800, height: 1000 };
    }

    /**
     * Capture current poster state from the editor
     */
    capturePosterState() {
        // Get the editor instance from window
        const editor = window.editor;
        if (!editor) {
            console.error('Magic Resize: Editor not found');
            return null;
        }

        // Capture the canvas element
        const canvas = editor.canvas;
        if (!canvas) {
            console.error('Magic Resize: Canvas not found');
            return null;
        }

        // Deep clone the elements array
        const elements = JSON.parse(JSON.stringify(editor.elements || []));
        
        // Get background color
        const backgroundColor = editor.backgroundColor || '#ffffff';

        // Store original dimensions
        const canvasRect = canvas.getBoundingClientRect();
        const originalWidth = 800; // Base canvas width
        const originalHeight = 1000; // Base canvas height

        return {
            elements,
            backgroundColor,
            originalWidth,
            originalHeight,
            timestamp: Date.now()
        };
    }

    /**
     * Calculate scale factors for resizing
     */
    calculateScales(targetWidth, targetHeight, originalWidth, originalHeight) {
        const scaleX = targetWidth / originalWidth;
        const scaleY = targetHeight / originalHeight;
        
        // Use the smaller scale to maintain aspect ratio and fit within target
        const uniformScale = Math.min(scaleX, scaleY);
        
        return {
            scaleX,
            scaleY,
            uniformScale,
            // Calculate offsets to center the content
            offsetX: (targetWidth - (originalWidth * uniformScale)) / 2,
            offsetY: (targetHeight - (originalHeight * uniformScale)) / 2
        };
    }

    /**
     * Resize a single element proportionally
     */
    resizeElement(element, scales) {
        const { uniformScale, offsetX, offsetY } = scales;
        
        // Create a deep copy
        const resized = { ...element };
        
        // Scale position (center the content)
        resized.x = (element.x * uniformScale) + offsetX;
        resized.y = (element.y * uniformScale) + offsetY;
        
        // Scale dimensions
        resized.width = element.width * uniformScale;
        resized.height = element.height * uniformScale;
        
        // Scale font size for text elements
        if (element.type === 'text' && element.fontSize) {
            resized.fontSize = Math.round(element.fontSize * uniformScale);
        }
        
        // Handle image elements - preserve aspect ratio
        if (element.type === 'image') {
            // Maintain aspect ratio for images
            const imgAspect = element.width / element.height;
            if (imgAspect > 1) {
                // Wide image
                resized.height = resized.width / imgAspect;
            } else {
                // Tall image
                resized.width = resized.height * imgAspect;
            }
        }
        
        // Scale border radius
        if (element.borderRadius) {
            resized.borderRadius = Math.round(element.borderRadius * uniformScale);
        }
        
        // Scale padding
        if (element.padding) {
            resized.padding = Math.round(element.padding * uniformScale);
        }
        
        return resized;
    }

    /**
     * Create a resized version of the poster
     */
    createResizedVersion(posterState, targetSize) {
        const { width, height, name, aspect } = targetSize;
        const { elements, backgroundColor, originalWidth, originalHeight } = posterState;
        
        // Calculate scales
        const scales = this.calculateScales(width, height, originalWidth, originalHeight);
        
        // Resize all elements
        const resizedElements = elements.map(el => this.resizeElement(el, scales));
        
        return {
            id: `resize_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name,
            aspect,
            width,
            height,
            elements: resizedElements,
            backgroundColor,
            scaleInfo: scales,
            originalState: posterState
        };
    }

    /**
     * Generate all resized versions
     */
    generateResizedVersions(posterState, selectedSizes = null) {
        if (!posterState) {
            console.error('Magic Resize: No poster state provided');
            return [];
        }

        const sizesToGenerate = selectedSizes || Object.keys(this.targetSizes);
        const versions = [];
        
        for (const sizeKey of sizesToGenerate) {
            const targetSize = this.targetSizes[sizeKey];
            if (targetSize) {
                const version = this.createResizedVersion(posterState, targetSize);
                versions.push(version);
            }
        }
        
        this.resizedVersions = versions;
        return versions;
    }

    /**
     * Create a canvas element for a resized version
     */
    createCanvasForVersion(version) {
        const canvas = document.createElement('canvas');
        canvas.width = version.width;
        canvas.height = version.height;
        canvas.style.width = version.width + 'px';
        canvas.style.height = version.height + 'px';
        
        const ctx = canvas.getContext('2d');
        
        // Fill background
        ctx.fillStyle = version.backgroundColor;
        ctx.fillRect(0, 0, version.width, version.height);
        
        // Render elements
        version.elements.forEach(element => {
            this.renderElementToCanvas(ctx, element);
        });
        
        return canvas;
    }

    /**
     * Render a single element to canvas context
     */
    renderElementToCanvas(ctx, element) {
        const { x, y, width, height, type } = element;
        
        ctx.save();
        
        // Apply rotation if exists
        if (element.rotation) {
            ctx.translate(x + width / 2, y + height / 2);
            ctx.rotate((element.rotation * Math.PI) / 180);
            ctx.translate(-width / 2, -height / 2);
        } else {
            ctx.translate(x, y);
        }
        
        // Clip to element bounds
        ctx.beginPath();
        if (element.borderRadius) {
            this.roundRect(ctx, 0, 0, width, height, element.borderRadius);
            ctx.clip();
        }
        
        switch (type) {
            case 'text':
                this.renderTextElement(ctx, element, width, height);
                break;
            case 'shape':
                this.renderShapeElement(ctx, element, width, height);
                break;
            case 'image':
                // For preview, show placeholder
                this.renderImagePlaceholder(ctx, element, width, height);
                break;
        }
        
        ctx.restore();
    }

    /**
     * Render text element
     */
    renderTextElement(ctx, element, width, height) {
        const { 
            text, 
            fontSize = 24, 
            fontWeight = '400', 
            fontFamily = 'Space Grotesk',
            textColor = '#1e293b',
            textAlign = 'center',
            padding = 0
        } = element;
        
        ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
        ctx.fillStyle = textColor;
        ctx.textAlign = textAlign;
        ctx.textBaseline = 'middle';
        
        const effectiveWidth = width - (padding * 2);
        const lines = this.wrapText(ctx, text, effectiveWidth);
        
        const lineHeight = fontSize * 1.2;
        const totalHeight = lines.length * lineHeight;
        const startY = (height - totalHeight) / 2 + (lineHeight / 2);
        
        let xPos = width / 2;
        if (textAlign === 'left') xPos = padding;
        if (textAlign === 'right') xPos = width - padding;
        
        lines.forEach((line, i) => {
            ctx.fillText(line, xPos, startY + (i * lineHeight));
        });
    }

    /**
     * Render shape element
     */
    renderShapeElement(ctx, element, width, height) {
        const { backgroundColor = '#3b82f6', borderRadius = 0 } = element;
        
        ctx.fillStyle = backgroundColor;
        
        if (borderRadius) {
            this.roundRect(ctx, 0, 0, width, height, borderRadius);
            ctx.fill();
        } else {
            ctx.fillRect(0, 0, width, height);
        }
    }

    /**
     * Render image placeholder
     */
    renderImagePlaceholder(ctx, element, width, height) {
        // Draw placeholder with icon
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(0, 0, width, height);
        
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(10, 10, width - 20, height - 20);
        ctx.setLineDash([]);
        
        ctx.fillStyle = '#64748b';
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('📷 Image', width / 2, height / 2);
    }

    /**
     * Helper: Draw rounded rectangle
     */
    roundRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }

    /**
     * Helper: Wrap text into lines
     */
    wrapText(ctx, text, maxWidth) {
        const words = text.split(' ');
        const lines = [];
        let currentLine = words[0];
        
        for (let i = 1; i < words.length; i++) {
            const word = words[i];
            const width = ctx.measureText(currentLine + ' ' + word).width;
            if (width < maxWidth) {
                currentLine += ' ' + word;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        }
        lines.push(currentLine);
        return lines;
    }

    /**
     * Export a version as PNG
     */
    exportVersion(version, filename = null) {
        const canvas = this.createCanvasForVersion(version);
        const link = document.createElement('a');
        link.download = filename || `poster_${version.name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    }

    /**
     * Apply a resized version to the editor (creates a new poster)
     */
    applyVersionToEditor(version) {
        const editor = window.editor;
        if (!editor) {
            console.error('Magic Resize: Editor not found');
            return false;
        }

        // Create new state with elements
        const newElements = JSON.parse(JSON.stringify(version.elements));
        
        // Apply to editor
        editor.elements = newElements;
        editor.backgroundColor = version.backgroundColor;
        
        // Update canvas size if needed - but keep visual centering
        if (editor.canvas) {
            // Store original dimensions for reference
            const originalWidth = 800;
            const originalHeight = 1000;
            
            // Set canvas dimensions
            editor.canvas.style.width = version.width + 'px';
            editor.canvas.style.height = version.height + 'px';
            
            // The canvas should maintain its center position via CSS/transform
            // The editor.fitToScreen() or setupAutoScale() should handle centering
        }
        
        // Re-render
        editor.render();
        
        // Re-apply auto-scale to ensure canvas is centered
        if (typeof editor.fitToScreen === 'function') {
            setTimeout(() => editor.fitToScreen(), 100);
        }
        
        return true;
    }
}

// Create global instance
window.magicResize = new MagicResize();

/**
 * UI Controller for Magic Resize
 */
class MagicResizeUI {
    constructor() {
        this.modal = null;
        this.previewContainer = null;
        this.isOpen = false;
    }

    /**
     * Open the Magic Resize modal
     */
    open() {
        if (this.isOpen) return;
        
        this.createModal();
        this.isOpen = true;
        document.body.style.overflow = 'hidden';
    }

    /**
     * Close the modal
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
     * Create the modal HTML structure
     */
    createModal() {
        const modal = document.createElement('div');
        modal.id = 'magicResizeModal';
        modal.className = 'magic-resize-modal';
        modal.innerHTML = `
            <div class="magic-resize-overlay" onclick="magicResizeUI.close()"></div>
            <div class="magic-resize-container">
                <div class="magic-resize-header">
                    <h2>🪄 Magic Resize</h2>
                    <p>Convert your poster to multiple social media sizes instantly</p>
                    <button class="magic-resize-close" onclick="magicResizeUI.close()">&times;</button>
                </div>
                
                <div class="magic-resize-options">
                    <h3>Select Sizes to Generate</h3>
                    <div class="size-options-grid">
                        <label class="size-option">
                            <input type="checkbox" value="instagramPost" checked>
                            <div class="size-option-content">
                                <span class="size-icon">📸</span>
                                <span class="size-name">Instagram Post</span>
                                <span class="size-dims">1080 &times; 1080</span>
                            </div>
                        </label>
                        <label class="size-option">
                            <input type="checkbox" value="instagramStory" checked>
                            <div class="size-option-content">
                                <span class="size-icon">📱</span>
                                <span class="size-name">Instagram Story</span>
                                <span class="size-dims">1080 &times; 1920</span>
                            </div>
                        </label>
                        <label class="size-option">
                            <input type="checkbox" value="poster" checked>
                            <div class="size-option-content">
                                <span class="size-icon">🖼️</span>
                                <span class="size-name">Poster (4:5)</span>
                                <span class="size-dims">1080 &times; 1350</span>
                            </div>
                        </label>
                        <label class="size-option">
                            <input type="checkbox" value="whatsappStatus">
                            <div class="size-option-content">
                                <span class="size-icon">💬</span>
                                <span class="size-name">WhatsApp Status</span>
                                <span class="size-dims">1080 &times; 1920</span>
                            </div>
                        </label>
                    </div>
                </div>
                
                <div class="magic-resize-actions">
                    <button class="magic-resize-btn primary" onclick="magicResizeUI.generate()">
                        <span class="btn-icon">✨</span>
                        Generate Sizes
                    </button>
                </div>
                
                <div class="magic-resize-preview" id="magicResizePreview" style="display: none;">
                    <h3>Generated Versions</h3>
                    <div class="preview-grid" id="previewGrid"></div>
                </div>
                
                <div class="magic-resize-loading" id="magicResizeLoading" style="display: none;">
                    <div class="loading-spinner"></div>
                    <p>Resizing your designs...</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.modal = modal;
        
        // Add CSS if not already added
        this.addStyles();
    }

    /**
     * Add CSS styles for the modal
     */
    addStyles() {
        if (document.getElementById('magicResizeStyles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'magicResizeStyles';
        styles.textContent = `
            .magic-resize-modal {
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
            
            .magic-resize-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.7);
                backdrop-filter: blur(8px);
            }
            
            .magic-resize-container {
                position: relative;
                width: 90%;
                max-width: 900px;
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
            
            .magic-resize-header {
                padding: 16px 24px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                position: relative;
            }
            
            .magic-resize-header h2 {
                color: white;
                font-size: 20px;
                font-weight: 700;
                margin: 0 0 4px 0;
            }
            
            .magic-resize-header p {
                color: rgba(255, 255, 255, 0.6);
                font-size: 12px;
                margin: 0;
            }
            
            .magic-resize-close {
                position: absolute;
                top: 20px;
                right: 24px;
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
            
            .magic-resize-close:hover {
                background: rgba(255, 255, 255, 0.2);
            }
            
            .magic-resize-options {
                padding: 16px 24px;
            }
            
            .magic-resize-options h3 {
                color: white;
                font-size: 14px;
                font-weight: 600;
                margin: 0 0 12px 0;
            }
            
            .size-options-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 10px;
            }
            
            .size-option {
                cursor: pointer;
                display: block;
            }
            
            .size-option input {
                display: none;
            }
            
            .size-option-content {
                padding: 12px;
                background: rgba(255, 255, 255, 0.05);
                border: 2px solid rgba(255, 255, 255, 0.1);
                border-radius: 10px;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 2px;
                transition: all 0.2s;
            }
            
            .size-option:hover .size-option-content {
                background: rgba(255, 255, 255, 0.1);
                border-color: rgba(255, 255, 255, 0.2);
            }
            
            .size-option input:checked + .size-option-content {
                background: rgba(99, 102, 241, 0.2);
                border-color: #6366f1;
            }
            
            .size-icon {
                font-size: 24px;
                margin-bottom: 4px;
            }
            
            .size-name {
                color: white;
                font-weight: 600;
                font-size: 14px;
            }
            
            .size-dims {
                color: rgba(255, 255, 255, 0.5);
                font-size: 12px;
            }
            
            .magic-resize-actions {
                padding: 0 24px 16px;
                display: flex;
                justify-content: center;
            }
            
            .magic-resize-btn {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                padding: 10px 24px;
                font-size: 14px;
                font-weight: 600;
                border: none;
                border-radius: 10px;
                cursor: pointer;
                transition: all 0.2s;
            }
            
            .magic-resize-btn.primary {
                background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
                color: white;
            }
            
            .magic-resize-btn.primary:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 30px rgba(99, 102, 241, 0.4);
            }
            
            .btn-icon {
                font-size: 18px;
            }
            
            .magic-resize-preview {
                padding: 16px 24px;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
                flex: 1;
                overflow-y: auto;
                max-height: 60vh;
                min-height: 200px;
            }
            
            .magic-resize-preview h3 {
                color: white;
                font-size: 14px;
                font-weight: 600;
                margin: 0 0 12px 0;
            }
            
            .preview-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                gap: 16px;
            }
            
            .preview-item {
                background: rgba(255, 255, 255, 0.05);
                border-radius: 10px;
                padding: 16px;
                text-align: center;
            }
            
            .preview-canvas-wrapper {
                background: white;
                border-radius: 8px;
                overflow: hidden;
                margin-bottom: 12px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                min-height: 200px;
                max-height: 300px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .preview-canvas-wrapper canvas {
                display: block;
                width: 100%;
                height: auto;
            }
            
            .preview-name {
                color: white;
                font-weight: 600;
                font-size: 14px;
                margin-bottom: 4px;
            }
            
            .preview-dims {
                color: rgba(255, 255, 255, 0.5);
                font-size: 12px;
                margin-bottom: 12px;
            }
            
            .preview-actions {
                display: flex;
                gap: 8px;
                justify-content: center;
            }
            
            .preview-btn {
                padding: 8px 16px;
                font-size: 12px;
                font-weight: 600;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                transition: all 0.2s;
            }
            
            .preview-btn.download {
                background: #10b981;
                color: white;
            }
            
            .preview-btn.download:hover {
                background: #059669;
            }
            
            .preview-btn.use {
                background: #3b82f6;
                color: white;
            }
            
            .preview-btn.use:hover {
                background: #2563eb;
            }
            
            .magic-resize-loading {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(15, 23, 42, 0.9);
                display: flex;
                padding: 24px;
                text-align: center;
                color: rgba(255, 255, 255, 0.8);
            }
            
            .magic-resize-loading .loading-spinner {
                width: 32px;
                height: 32px;
                border: 3px solid rgba(255, 255, 255, 0.1);
                border-top-color: #6366f1;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 12px;
            }
            
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
            
            .magic-resize-loading p {
                color: white;
                font-weight: 500;
            }
        `;
        
        document.head.appendChild(styles);
    }

    /**
     * Generate resized versions
     */
    async generate() {
        const loadingEl = document.getElementById('magicResizeLoading');
        const previewEl = document.getElementById('magicResizePreview');
        const previewGrid = document.getElementById('previewGrid');
        
        // Get selected sizes
        const checkboxes = this.modal.querySelectorAll('.size-option input:checked');
        const selectedSizes = Array.from(checkboxes).map(cb => cb.value);
        
        if (selectedSizes.length === 0) {
            alert('Please select at least one size');
            return;
        }
        
        // Show loading
        loadingEl.style.display = 'flex';
        
        // Small delay to allow UI to update
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Capture and generate
        const posterState = window.magicResize.capturePosterState();
        if (!posterState) {
            loadingEl.style.display = 'none';
            alert('Could not capture poster state');
            return;
        }
        
        const versions = window.magicResize.generateResizedVersions(posterState, selectedSizes);
        
        // Render previews
        previewGrid.innerHTML = '';
        versions.forEach(version => {
            const canvas = window.magicResize.createCanvasForVersion(version);
            
            const previewItem = document.createElement('div');
            previewItem.className = 'preview-item';
            previewItem.innerHTML = `
                <div class="preview-canvas-wrapper"></div>
                <div class="preview-name">${version.name}</div>
                <div class="preview-dims">${version.width} × ${version.height}px</div>
                <div class="preview-actions">
                    <button class="preview-btn download" onclick="magicResizeUI.downloadVersion('${version.id}')">
                        ⬇️ Download
                    </button>
                    <button class="preview-btn use" onclick="magicResizeUI.useVersion('${version.id}')">
                        ✓ Use This
                    </button>
                </div>
            `;
            
            previewItem.querySelector('.preview-canvas-wrapper').appendChild(canvas);
            previewGrid.appendChild(previewItem);
        });
        
        // Store versions for later reference
        this.generatedVersions = versions;
        
        // Show preview
        loadingEl.style.display = 'none';
        previewEl.style.display = 'block';
    }

    /**
     * Download a specific version
     */
    downloadVersion(versionId) {
        const version = this.generatedVersions?.find(v => v.id === versionId);
        if (version) {
            window.magicResize.exportVersion(version);
        }
    }

    /**
     * Use a specific version in the editor
     */
    useVersion(versionId) {
        const version = this.generatedVersions?.find(v => v.id === versionId);
        if (version) {
            if (confirm(`Apply "${version.name}" to the editor? This will replace your current poster.`)) {
                window.magicResize.applyVersionToEditor(version);
                this.close();
            }
        }
    }
}

// Create global UI instance
window.magicResizeUI = new MagicResizeUI();

console.log('✨ Magic Resize loaded successfully!');
