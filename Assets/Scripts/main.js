const IMG_PANEL_ID = 'Img-Panel';
const TEXT_PANEL_ID = 'Text-Panel'
const DARK_THEME_CLASS = 'DarkTheme';
const ThemeToggler = document.querySelector("#App-Theme-TogglerBtn");
const ImgPanelToggler = document.querySelector("#Img-Panel-TogglerBtn");
const ResetFiltersBtn = document.querySelector("#resetFiltersBtn");
const TextPanelToggler = document.querySelector("#Text-Panel-TogglerBtn");
const ClosePanelBtn = document.querySelector("#App-Sidebar-CloseBtn");
const Sliders = document.querySelectorAll("input[id$=-slider]");
const ColorSetters = document.querySelectorAll("input[type=color]");
const AppSidebar = document.querySelector(".App-Sidebar");
const TextPanel = document.querySelector(`#${TEXT_PANEL_ID}`);
const ImgPanel = document.querySelector(`#${IMG_PANEL_ID}`);
const body = document.querySelector("body");
const image = document.querySelector(".App-Canvas-Image");

document.addEventListener("DOMContentLoaded", _ => {
    
    TextPanelToggler.onclick = _ => openPanel(TEXT_PANEL_ID);
    ImgPanelToggler.onclick = _ => openPanel(IMG_PANEL_ID);
    ResetFiltersBtn.onclick = _ => setFiltersDefault();
    ClosePanelBtn.onclick = closePanel;
    ThemeToggler.onclick = toogleTheme;
    Sliders.forEach(Slider =>{
        Slider.oninput = e => setFilter(e.target);
        Slider.onchange = e => setFilter(e.target);
    } );
    ColorSetters.forEach(Setter => Setter.oninput = e=> setColor(e));

    setFiltersDefault();
});

/**
 * Mostrar el panel indicado en el targetPanel
 * @param {string} targetPanel id del panel a mostrar
 */
const openPanel = targetPanel => {

    AppSidebar.classList.remove('d-none');
    switch(targetPanel)
    {
        case IMG_PANEL_ID: 
            TextPanel.classList.add('d-none');
            ImgPanel.classList.remove('d-none');
            break;

        case TEXT_PANEL_ID: 
            ImgPanel.classList.add('d-none');
            TextPanel.classList.remove('d-none');
            break;

        default:break;
    }
}

const closePanel = () => AppSidebar.classList.add('d-none');

const toogleTheme = () =>{
    const Icon = ThemeToggler.querySelector('.btn-Icon');

    if (body.classList.contains(DARK_THEME_CLASS)) {
        body.classList.remove(DARK_THEME_CLASS);
        Icon.classList.remove('fas');
        Icon.classList.add('far');
        ThemeToggler.lastChild = 'Modo Obscuro';
        ThemeToggler.ariaLabel = 'Cambiar a Modo Obscuro';
    }
    else{
        body.classList.add(DARK_THEME_CLASS);
        Icon.classList.remove('far');
        Icon.classList.add('fas');
        ThemeToggler.lastChild = 'Modo claro';
        ThemeToggler.ariaLabel = 'Cambiar a Modo Claro';
    }
}

/**
 * Setea el filtro en la imagen e informa el valor del input y su unidad
 * @param {Element} Slider elemento slider del panel de imagen
 */
const setFilter = (Slider) => {
    
    updateFilterInfo(Slider);
    
    //establecer filtros en la imagen
    image.style.filter  = getFilters();
}

const setFiltersDefault = () => {

    Sliders.forEach(Slider => {

        Slider.value = Slider.dataset.default;
        updateFilterInfo(Slider);
    })

    image.style.filter = getFilters();
}

/**
 * obtiene un string con todos los valores actuales de los filtros
 * @returns {string} 
 */
const getFilters = () => {

    let cssTextFilters = "";
    Sliders.forEach(Filter => {

        let value = ` ${Filter.dataset.type}(${Filter.value}${Filter.dataset.unit})`;
        cssTextFilters += value;
    });

    return cssTextFilters.trimStart();
}

/**
 * Setea el color seleccionado e informa el valor hex
 * @param {Event} e evento disparado desde un input de tipo color
 */
const setColor = e => {
    let SelectedColorInfo = document.querySelector(e.target.dataset.info);
    SelectedColorInfo.textContent = `${e.target.value}`;
}

function updateFilterInfo(Slider) {

    //indicar valor del input
    let SliderValueInfo = Slider.parentElement.querySelector(".Panel-ctrl-slider-value");
    SliderValueInfo.textContent = `${Slider.value}${Slider.dataset.unit}`;

    //obtener porcentaje del valor del input
    let range = Slider.max - Slider.min;
    let correctedStartValue = Slider.value - Slider.min;
    let widthPercentage = (correctedStartValue * 100) / range;
    let newWith = parseInt(widthPercentage);

    //Setear el background image
    Slider.style.backgroundImage = `linear-gradient(to right,
         var(--Theme-BgColor--OnActive) ${newWith}%,
         var(--Theme-CtrlBgColor) ${newWith}%)`;
}
