# Editor Color Scheme Update - Website Matching

## 🎨 New Color Scheme (Matching Website)

### Primary Colors:
- **Primary Orange**: `#F97316` (Website's main orange)
- **Secondary Pink**: `#EC4899` (Website's accent pink)  
- **Accent Purple**: `#7c3aed` (Website's purple)
- **Accent Blue**: `#3b82f6` (Website's blue)

## 🔄 Files Updated:

### 1. CSS Variables (`App.css`)
```css
--primary-color: #F97316;        /* Was: #0d9488 (teal) */
--primary-hover: #EC4899;       /* Was: #0f766e (teal) */
--secondary-color: #7c3aed;     /* New: Website purple */
--accent-color: #3b82f6;         /* New: Website blue */
```

### 2. Canvas Selection Colors (`CanvasArea.tsx`)
```typescript
// Selection border and corners
canvas.selectionBorderColor = '#F97316';  // Was: #0d9488
borderColor: '#F97316';                   // Was: #0d9488  
cornerColor: '#F97316';                   // Was: #0d9488

// Default shape colors
fill: element.styles.fill || '#F97316';   // Was: #0d9488
```

### 3. Button Colors (`App.tsx`)
```typescript
// Export button
className="gap-2 bg-orange-600 hover:bg-orange-700"  // Was: bg-teal-600
```

### 4. UI Components (`index.css`)
```css
/* Focus styles */
outline: 2px solid var(--primary-color);  // Uses orange now

/* Button classes */  
.btn-teal { @apply bg-orange-600 text-white hover:bg-orange-700; }

/* Gradients */
background: linear-gradient(135deg, var(--primary-color), var(--primary-hover));

/* Loading spinner */
border-top-color: var(--primary-color);  // Orange spinner
```

### 5. Template Colors (`TemplatesPanel.tsx`)
```typescript
// Template backgrounds and elements
backgroundColor: '#F97316';  // Was: #0d9488
styles: { fill: '#F97316' }; // Was: #0d9488
```

### 6. Element Defaults (`ElementsPanel.tsx`)
```typescript
// Default shape colors
fill: '#F97316',  // Was: #0d9488
```

## 🎯 Result:
The editor now perfectly matches the website's color scheme:
- ✅ Orange primary color (#F97316) for main actions and selections
- ✅ Pink accent (#EC4899) for hover states  
- ✅ Purple and blue accents for variety
- ✅ Consistent with website's gradient theme
- ✅ All UI elements updated: buttons, selections, templates, shapes

The editor now looks like a natural extension of the main website! 🚀
