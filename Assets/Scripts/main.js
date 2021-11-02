const IMG_PANEL_ID = 'Img-Panel';
const TEXT_PANEL_ID = 'Text-Panel'
const DARK_THEME_CLASS = 'DarkTheme';
const BLEND_MODE_ID = '#selected-blendmode-color';
const TEXT_COLOR_ID = '#selected-text-color'
const BGTEXT_COLOR_ID = '#selected-bgtext-color';

const TextCtrls = document.querySelectorAll("textarea[data-location],input[data-location]");
const CanvasTopText = document.querySelector(".App-Canvas-TopText");
const CanvasBottomText = document.querySelector(".App-Canvas-BottomText");
const ThemeToggler = document.querySelector("#App-Theme-TogglerBtn");
const ImgPanelToggler = document.querySelector("#Img-Panel-TogglerBtn");
const UrlImageBtn = document.querySelector("#input-url");
const ResetFiltersBtn = document.querySelector("#resetFiltersBtn");
const TextPanelToggler = document.querySelector("#Text-Panel-TogglerBtn");
const ClosePanelBtn = document.querySelector("#App-Sidebar-CloseBtn");
const Sliders = document.querySelectorAll("input[id$=-slider]");
const ColorSetters = document.querySelectorAll("input[type=color],#transparentOption");
const AppSidebar = document.querySelector(".App-Sidebar");
const TextPanel = document.querySelector(`#${TEXT_PANEL_ID}`);
const ImgPanel = document.querySelector(`#${IMG_PANEL_ID}`);
const body = document.querySelector("body");
const image = document.querySelector(".App-Canvas-Image");
const FontSetter = document.querySelector('select[name=fuente]');

document.addEventListener("DOMContentLoaded", _=> {
    
    TextPanelToggler.onclick = _=> openPanel(TEXT_PANEL_ID);
    ImgPanelToggler.onclick = _=> openPanel(IMG_PANEL_ID);
    ResetFiltersBtn.onclick = _=> setFiltersDefault();
    UrlImageBtn.oninput = e=> setImageMeme(e.target.value);
    ClosePanelBtn.onclick = closePanel;
    ThemeToggler.onclick = toogleTheme;
    Sliders.forEach(Slider => Slider.oninput = e=> setFilter(e.target));
    ColorSetters.forEach(ColorSetter => ColorSetter.oninput = e=> setColor(e.target));
    TextCtrls.forEach(TextCtrl => TextCtrl.oninput = e=> setText(e.target));
    FontSetter.oninput = e => setFont(e.target);

    setFiltersDefault();
    setColorsDefult();
});

/** Mostrar el panel indicado en el targetPanel y poner en foco el boton de cierre
 * @param {string} targetPanel id del panel a mostrar
 */
const openPanel = targetPanel => {

    AppSidebar.classList.remove('d-none');
    switch(targetPanel)
    {
        case TEXT_PANEL_ID: 
            ImgPanel.classList.add('d-none');
            TextPanel.classList.remove('d-none');
            break;

        default:
        case IMG_PANEL_ID: 
            TextPanel.classList.add('d-none');
            ImgPanel.classList.remove('d-none');
            break;
    }
    
    AppSidebar.dataset.currentPanel = targetPanel;
    ClosePanelBtn.focus();
}

/** Cerrar el panel y devolver el foco al toggler que lo abrio
 */
const closePanel = () => {
    AppSidebar.classList.add('d-none');

    switch (AppSidebar.dataset.currentPanel) {
        case TEXT_PANEL_ID: TextPanelToggler.focus(); break;
        default:
        case IMG_PANEL_ID: ImgPanelToggler.focus(); break;
    }
}

const toogleTheme = () => {
    const Icon = ThemeToggler.querySelector('.btn-Icon');

    //si cambio la presencia del Dark Theme a presente, entonces el proximo cambio sera Light theme
    if (body.classList.toggle(DARK_THEME_CLASS)){
        Icon.classList.replace('far', 'fas');
        ThemeToggler.lastElementChild.textContent = 'Modo Claro';
    }
    else{
        Icon.classList.replace('fas', 'far');
        ThemeToggler.lastElementChild.textContent = 'Modo Obscuro';
    }

    ThemeToggler.ariaLabel = `Cambiar a ${ThemeToggler.lastElementChild.textContent}`;
}

/** Setea el filtro en la imagen e informa el valor del input y su unidad
 * @param {Element} Slider elemento slider del panel de imagen
 */
const setFilter = (Slider) => {
    
    updateFilterInfo(Slider);

    //establecer filtros en la imagen
    let newfilters = getFilters();
    image.style.filter = newfilters;
}

/** Recorre cada filtro y pone su valor por default guardado en su data "default"
 */
const setFiltersDefault = () => {

    Sliders.forEach(Slider => {

        Slider.value = Slider.dataset.default;
        setFilter(Slider);
    })
}

/** obtiene un string con todos los valores actuales de los filtros
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

/** Setea el color seleccionado
 * @param {Element} ColorSetter Input de tipo color sobre el cual se disparado un evento
 */
const setColor = ColorSetter => {
    let TargetInfo = ColorSetter.dataset.info;
    let ColorValue = getColorFrom(ColorSetter);

    switch (TargetInfo) {
        case BLEND_MODE_ID: image.parentElement.style.backgroundColor = ColorValue; break;
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

    updateSelectedColorInfo(TargetInfo, ColorValue);
}

const setColorsDefult = () => {

    ColorSetters.forEach(ColorSetter => {

        switch (ColorSetter.type) {
            case 'color': 
                ColorSetter.value = ColorSetter.dataset.default;
                setColor(ColorSetter);
                break;
            case 'checkbox': 
                ColorSetter.checked = false;
            default:
        }
    })
}

const getColorFrom = ColorSetter => {

    let NextColorValue = '';

    switch (ColorSetter.type) {
        case 'color': NextColorValue = ColorSetter.value; break;
        
        case 'checkbox': //Si el checkbox esta marcado se devuelve transparente, si no el color previo
            let InputColor = document.querySelector(`input[type="color"][data-info="${ColorSetter.dataset.info}"]`);
            NextColorValue = ColorSetter.checked ? 'transparent': InputColor.value;
            InputColor.disabled = ColorSetter.checked;
        break;
        default: break;
    }

    return NextColorValue;
}

/** Recibe la ULR de una img y la intenta cargar en el canvas, 
 *  Luego llama a setear la relacion de aspecto de la img
 * @param {URL} URL 
 */
const setImageMeme = (URL) => {

    if(URL){
        let img = new Image();
        img.src = URL;

        img.onload = e => {
            image.style.backgroundImage = `url("${URL}")`;
            setAspectRatio(e.target.height, e.target.width);
        }
    }
}

/**  En base a un alto y un ancho establece el aspecto de radio del meme
 * @param {Number} ImgHeight Alto de la imagen a cargar
 * @param {Number} ImgWidth Ancho de la imagen a cargar
 */
const setAspectRatio = (ImgHeight, ImgWidth) => {
    const Divisor = GetDivisor(ImgWidth, ImgHeight);
    image.style.aspectRatio = `${ImgWidth/Divisor}/${ImgHeight/Divisor}`;
}

/**
 * Calcula de forma recursiva el máximo común divisor a usar en el calculo del aspect-radio
 * @param {Number} a alto/ancho de la img
 * @param {Number} b alto/ancho de la img
 * @returns {Number} Divisor
 */
const GetDivisor = (a, b) => b ? GetDivisor(b, a % b): a

/** Establecer las propiedades de los textos superiores e inferiores,
 * si es del tipo textarea se establecera el textContent y si es del tipo checkbox se definira su display
 * @param {Element} TextCtrl Control del panel de texto con un data-location que defina si se aplica a un Top o un Bottom Text
 */
const setText = TextCtrl => {

    const {location} = TextCtrl.dataset;
    let CanvasText = document.querySelector(`.App-Canvas-${location}Text`);

    //si es del tipo textarea se quiere establecer el valor del texto
    if(TextCtrl.type === 'textarea')
        CanvasText.textContent = TextCtrl.value;

    //si es un control de tipo checkbox se quiere usar o no su texto
    if(TextCtrl.type === 'checkbox')
        CanvasText.style.display = TextCtrl.checked ? 'none':'block';
}

/** Establecer las propiedades de los textos superiores e inferiores,
 * Setea la fuente, y una fuente en caso de que la seleccionada falle
 * @param {Element} TextCtrl Control del panel de texto con un data-location que defina si se aplica a un Top o un Bottom Text
 */
const setFont = TextCtrl => {

    const font = `"${TextCtrl.value}", "${TextCtrl.dataset.default}"`;
    CanvasTopText.style.fontFamily = font;
    CanvasBottomText.style.fontFamily = font;
}

const updateFilterInfo = Slider => {

    //indicar valor del input
    let SliderValueInfo = Slider.parentElement.querySelector(".Panel-ctrl-slider-value");
    SliderValueInfo.textContent = `${Slider.value}${Slider.dataset.unit}`;

    //obtener porcentaje del valor del input
    let range = Slider.max - Slider.min;
    let correctedStartValue = Slider.value - Slider.min;
    let widthPercentage = (correctedStartValue * 100) / range;
    let newWith = parseInt(widthPercentage);

    //Setear el background image, para marcar una linea desde el principio al valor
    Slider.style.backgroundImage = `linear-gradient(to right,
         var(--Theme-BgColor--OnActive) ${newWith}%,
         var(--Theme-CtrlBgColor) ${newWith}%)`;
}

/** informa el valor hex
 * @param {String} TargetInfo 
 * @param {String} ColorValue 
 */
const updateSelectedColorInfo = (TargetInfo, ColorValue) => {

    let SelectedColorInfo = document.querySelector(TargetInfo);
    SelectedColorInfo.textContent = ColorValue;
}