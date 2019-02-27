export const photosInputInit = function () {
  const input = document.querySelector('.photo-input__field');
  input.addEventListener('change', () => {
    if (input.files.length) {
      this.append(input.files)
    }
  })
};

export const dragNDropInit = function () {
  const preventDefaultHandler = (event) => {
    event.preventDefault();
    event.stopPropagation()
  };

  const dropArea = document.querySelector('.photo-input');
  dropArea.addEventListener('dragenter', preventDefaultHandler, false);
  dropArea.addEventListener('dragleave', preventDefaultHandler, false);
  dropArea.addEventListener('dragover', preventDefaultHandler, false);
  dropArea.addEventListener('drop', (event) => {
    const filesList = Array.from(event.dataTransfer.files).filter(file => file.type.match('image/*'));
    if (filesList.length) {
      this.append(filesList)
    }
  })
};

export const removeButtonsInit = () => {
  const removeButtons = document.querySelectorAll('.list-item__remove-button');
  removeButtons.forEach((removeButton) => {
    removeButton.addEventListener('click', () => {
      const list = document.querySelector('.preview__list');
      const listItem = removeButton.closest('.preview__list-item');
      const removeIndex = Array.from(list.children).indexOf(listItem);

      list.removeChild(listItem);
      fileReadersList.splice(removeIndex, 1);

      if (!fileReadersList.length) {
        const preview = document.querySelector('.photo-input__preview');
        const emptyInput = document.querySelector('.photo-input__body');
        preview.style.display = 'none';
        emptyInput.style.display = 'flex'
      }
    })
  })
};