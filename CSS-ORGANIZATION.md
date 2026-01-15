# STYLE.CSS - GUIDA ALL'ORGANIZZAZIONE

## 📋 Indice delle Sezioni

### 1. CSS VARIABLES (Righe 1-70)
- `:root` - Variabili dark mode
- `[data-theme="light"]` - Variabili light mode

### 2. RESET & BASE STYLES (Righe 71-120)
- Reset CSS
- Body styles
- Loader/Loading screen

### 3. LAYOUT & GRID BACKGROUND (Righe 121-450)
- Main container
- Grid background animato
- Triangoli interattivi

### 4. NAVIGATION (Righe 150-250)
- Navbar styles
- Menu hamburger
- Dark/Light mode toggle

### 5. HERO SECTION (Righe 250-400)
- Giant name animation
- 3D Model container
- Typing effect

### 6. WORKS SECTION (Righe 550-750)
- Horizontal scroll container
- Work cards
- Lightbox gallery

### 7. SERVICES SECTION (Righe 950-1050)
- Sticky scroll wrapper
- Service cards
- Card animations

### 8. DEV PHASES SECTION (Righe 1100-1200)
- Horizontal scroll
- Phase cards
- Timeline

### 9. CONTACTS SECTION (Righe 1220-1400)
- Contact info cards
- Booking card
- Booking modal

### 10. MODALS & OVERLAYS (Righe 1350-1500)
- Booking modal
- Lightbox
- Overlay styles

### 11. FORMS & INPUTS (Righe 1680-1750)
- Form groups
- Input fields
- Textarea
- Buttons

### 12. LIGHT MODE OVERRIDES (Righe 1750-1840)
- Service cards light mode
- Contact cards light mode
- Phase cards light mode
- Booking trigger light mode

### 13. RESPONSIVE MEDIA QUERIES (Da aggiungere alla fine)
- Mobile (max-width: 768px)
- Tablet (max-width: 1024px)
- Desktop (min-width: 1024px)

## 🔍 Come Trovare una Sezione

### Cerca per Classe CSS:
- **Services**: `.service-card`, `.services-grid`
- **Contacts**: `.contact-info-card`, `.booking-card`
- **Dev Phases**: `.phase-card`, `.phases-horizontal-section`
- **Works**: `.works-horizontal-section`, `.work-card`

### Cerca per ID:
- `#servizi` - Sezione services
- `#contatti` - Sezione contatti
- `#fasi` - Sezione dev phases
- `#works` - Sezione works

## 📝 Note di Organizzazione

1. **Variabili CSS** sono all'inizio per facile accesso
2. **Light mode overrides** sono raggruppati insieme verso la fine
3. **Media queries** dovrebbero essere alla fine (da consolidare)
4. Ogni sezione principale ha un commento header `/* ======== */`

## 🎨 Convenzioni di Naming

- `.section-name` - Sezioni principali
- `.component-name` - Componenti riutilizzabili
- `.element-name` - Elementi specifici
- `[data-theme="light"]` - Override per light mode
- `@media` - Responsive breakpoints

## 🔧 Prossimi Passi per Migliorare l'Organizzazione

1. ✅ Aggiunto indice all'inizio del file
2. ✅ Aggiunto commento sezione Reset & Base
3. ⏳ Aggiungere commenti per ogni sezione principale
4. ⏳ Consolidare tutte le media queries alla fine
5. ⏳ Raggruppare meglio gli stili correlati
