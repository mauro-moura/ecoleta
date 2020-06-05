
function populateUfs() {
    const ufSelect = document.querySelector("select[name=uf]")    
    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome")
        .then( res => res.json() )
        .then( states => {
            for( const state of states ) {
                ufSelect.innerHTML += `<option value="${state.id}">${state.nome}</option>`
            }
        } )
}

populateUfs()

function getCities(event) {
    const citySelect = document.querySelector("select[name=city]")
    const stateInput = document.querySelector("input[name=state]")

    const ufValue = event.target.value

    const indexOfSelectedState = event.target.selectedIndex
    stateInput.value = event.target.options[indexOfSelectedState].text

    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValue}/municipios?orderBy=nome`

    citySelect.innerHTML = "<option value=>Selecione a cidade</option>"
    citySelect.disabled = true

    fetch(url)
        .then( res => res.json() )
        .then( cities => {
            for( const city of cities ) {
                citySelect.innerHTML += `<option value="${city.nome}">${city.nome}</option>`
            }

            citySelect.disabled = false
        } )
}

document
    .querySelector("select[name=uf]")
    .addEventListener("change", getCities)

// Items de coleta
const itemsToCollect = document.querySelectorAll(".items-grid li")

for (const item of itemsToCollect) {
    item.addEventListener("click", handleSelectedItem)
}

let selectedItems = []
const collectdItems = document.querySelector("input[name=items")

function handleSelectedItem(event) {

    const itemLi = event.target
    // Add or Remove Class on JS
    itemLi.classList.toggle("selected")

    const itemId = itemLi.dataset.id

    // Verificar se existem itens selecionados
    // Se sim, pegar os itens

    const alreadySelected = selectedItems.findIndex( item => {
        const itemFound = item == itemId
        return itemFound
    } )
    
    // se já estiver selecionado, tirar da seleção
    if(alreadySelected != -1) {
        const fileteredItems = selectedItems.filter( item => {
            const itemIsDifferent = item != itemId
            return itemIsDifferent
        })
        selectedItems = fileteredItems
    } else {
        // se não estiver selecionado, adicionar à seleção
        selectedItems.push(itemId)
    }

    // atualizar o campo escondido com os itens selecionados
    collectdItems.value = selectedItems
}
