export const genHTML = (options) => {
  const button = (data) => {
    if (!data.active)
      return {
        img: 'img/not_active.png',
        class: 'ad-selector__platform-button--not-active',
        type: 'not-active'
      };

    if (options.canChangeData)
      return {
        img: 'img/settings.png',
        class: 'ad-selector__platform-button--settings',
        type: 'settings'
      };

    if (data.changed)
      return {
        img: 'img/changed.png',
        class: 'ad-selector__platform-button--changed',
        type: 'changed'
      };
    else
      return {
        img: 'img/active.png',
        class: 'ad-selector__platform-button--active',
        type: 'active'
      };
  };

  let markup = '';
  for (let data of options.platformsData) {
    const buttonData = button(data);

    markup += `
      <li class="ad-selector__platform">
        <label class="form-checkbox-label">
          <input class="form-checkbox" id="${data.id}" 
           ${options.showCheckboxes && data.active ? '' : 'disabled'} type="checkbox"
           ${options.standardPlatformsIds.includes(data.id) && data.active ? 'checked' : ''}> 
          <span class="checkmark" 
            style="${options.showCheckboxes ? '' : 'display: none'}"></span>
          <div class="ad-selector__platform-info">
            <img class="ad-selector__platform-icon" 
               src="${data.icon}" width="50" height="50">
            <div class="wrapper">
              <p class="ad-selector__platform-name">${data.name}</p>
              <p class="ad-selector__platform-descr">${data.description}</p>
            </div>
          </div>

          <button type="button" data-id="${data.id}"
                  style="${options.showStatuses || options.canChangeData && data.active ?
    '' : 'display: none'}"
                  class="ad-selector__platform-button ${buttonData.class}
                         ad-selector__platform-button--tooltip
                         ad-selector__platform-button--tooltip-${buttonData.type}"
                  ${buttonData.class.includes('settings') ? '' : 'tabindex="-1"'}>
            <span class="ad-selector__platform-button 
                  ad-selector__platform-button-icon--${buttonData.type}"
                  data-id="${data.id}"></span>
          </button>
        </label>
      </li>
    `;
  }

  return markup;
};