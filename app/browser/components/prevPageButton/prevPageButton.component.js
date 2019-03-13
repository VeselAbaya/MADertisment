export const prevPageButtonInit = () => {
  document.querySelector('.prev-page-button').addEventListener('click', () => {
    window.history.back();
  })
};