import {formInit} from "../../common/formInit/formInit"

export const selectsInit = () => {
    const selects = document.querySelectorAll('.form-select')
    selects.forEach(select => {
        select.moveLabel = false
    })
    formInit(Array.from(selects))
}
