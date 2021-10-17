const IMG_PANEL_ID = 'Img-Panel';
const TEXT_PANEL_ID = 'Text-Panel'
const DARK_THEME_CLASS = 'DarkTheme';
const ThemeToggler = document.querySelector("#App-Theme-TogglerBtn");
const ImgPanelToggler = document.querySelector("#Img-Panel-TogglerBtn");
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
    ClosePanelBtn.onclick = closePanel;
    ThemeToggler.onclick = toogleTheme;
    Sliders.forEach(Slider => Slider.oninput = e => setFilter(e));
    ColorSetters.forEach(Setter => Setter.oninput = e=> setColor(e));
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
 * @param {Event} e evento disparado desde un input del tipo range
 */
const setFilter = e => {
    
    let fill = e.target.parentElement.querySelector(".bar .fill");
    let SliderValueInfo =  e.target.parentElement.querySelector(".Panel-ctrl-slider-value")

    //obtener porcentaje del input y Setear width del fill
    let range = e.target.max - e.target.min;
    let correctedStartValue = e.target.value - e.target.min;
    let widthPercentage = (correctedStartValue * 100) / range;
    fill.style.width = `${widthPercentage}%`;

    //indicar valor del input
    SliderValueInfo.textContent = `${e.target.value}${e.target.dataset.unit}`;

    //establecer filtros en la imagen
    image.style.filter  = getFilters();
}

/**
 * Setea el color seleccionado e informa el valor hex
 * @param {Event} e evento disparado desde un input de tipo color
 */
const setColor = e => {
    let SelectedColorInfo = document.querySelector(e.target.dataset.info);
    SelectedColorInfo.textContent = `${e.target.value}`;
}

const getFilters = () => {

    let cssTextFilters = "";
    Sliders.forEach(Filter => {

        let value = ` ${Filter.dataset.type}(${Filter.value}${Filter.dataset.unit})`;
        cssTextFilters += value;
    });

    return cssTextFilters.trimStart();
}