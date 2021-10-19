const IMG_PANEL_ID = 'Img-Panel';
const TEXT_PANEL_ID = 'Text-Panel'
const DARK_THEME_CLASS = 'DarkTheme';
const BLEND_MODE_ID = '#selected-blendmode-color';
const TEXT_COLOR_ID = '#selected-text-color'
const BGTEXT_COLOR_ID = '#selected-bgtext-color';

const TextAreaCtrls = document.querySelectorAll("textarea");
const CanvasTopText = document.querySelector(".App-Canvas-TopText");
const CanvasBottomText = document.querySelector(".App-Canvas-BottomText");
const ThemeToggler = document.querySelector("#App-Theme-TogglerBtn");
const ImgPanelToggler = document.querySelector("#Img-Panel-TogglerBtn");
const UrlImageBtn = document.querySelector("#input-url");
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
    UrlImageBtn.oninput = e => setImageMeme(e.target.value);
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
 * Mostrar el panel indicado en el targetPanel y poner en foco el boton de cierre
 * @param {string} targetPanel id del panel a mostrar
 */
const openPanel = targetPanel => {

    AppSidebar.classList.remove('d-none');
    switch(targetPanel)
    {
        case IMG_PANEL_ID: 
            TextPanel.classList.add('d-none');
            ImgPanel.classList.remove('d-none');
            ImgPanel.focus();
            AppSidebar.dataset.currentPanel = IMG_PANEL_ID;
            break;

        case TEXT_PANEL_ID: 
            ImgPanel.classList.add('d-none');
            TextPanel.classList.remove('d-none');
            TextPanel.focus();
            AppSidebar.dataset.currentPanel = TEXT_PANEL_ID;
            break;

        default:break;
    }

    ClosePanelBtn.focus();
}

/**
 * Cerrar el panel y devolver el foco al toggler que lo abrio
 */
const closePanel = () => {
    AppSidebar.classList.add('d-none');

    switch (AppSidebar.dataset.currentPanel) {
        case TEXT_PANEL_ID: TextPanelToggler.focus(); break;
        default:
        case IMG_PANEL_ID: ImgPanelToggler.focus(); break;
    }
}

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
    let newfilters = getFilters();
    image.style.filter = newfilters;
}

/**
 * Recorre cada filtro y pone su valor por default guardado en su data "default"
 */
const setFiltersDefault = () => {

    Sliders.forEach(Slider => {

        Slider.value = Slider.dataset.default;
        updateFilterInfo(Slider);
    })

    //establecer filtros en la imagen
    let newfilters = getFilters();
    image.style.filter = newfilters;
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
 * Setea el color seleccionado, informa el valor hex
 * @param {Event} e evento disparado desde un input de tipo color
 */
const setColor = e => {

    let TargetInfo = e.target.dataset.info;
    let ColorValue = e.target.value;
    let SelectedColorInfo = document.querySelector(TargetInfo);

    SelectedColorInfo.textContent = ColorValue.toUpperCase();

    switch (TargetInfo) {
        case BLEND_MODE_ID: image.style.backgroundColor = ColorValue; break;

        case BGTEXT_COLOR_ID: 
            CanvasTopText.style.backgroundColor = ColorValue;
            CanvasBottomText.style.backgroundColor = ColorValue;
        break;

        case TEXT_COLOR_ID: 
            CanvasTopText.style.color = ColorValue;
            CanvasBottomText.style.color = ColorValue;
        break;
        default:
    }
}

const setImageMeme = (URL) => {

    if(URL)
        image.style.backgroundImage = `url("${URL}")`;
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
