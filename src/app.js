"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//selectors----------------------------------------------------------------------|
//selectors----------------------------------------------------------------------|
const createBtn = document.getElementById("createBtn");
const title = document.getElementById("title");
const description = document.getElementById("description");
const editBtn = document.getElementById("editBtn");
const colorSelection = (document.getElementById("colorSelection"));
const itemsContainer = (document.getElementsByClassName("todo-container")[0]);
const errorTag = (document.getElementsByClassName("errorTag")[0]);
const editActionContainer = (document.getElementById("editActions"));
const selectedBtn = document.getElementById("selectedBtn");
const unSelectedBtn = (document.getElementById("unSelectedBtn"));
const deletedBtn = document.getElementById("deletedBtn");
var CardShadowColor;
(function (CardShadowColor) {
    CardShadowColor["DEFAULT"] = "default";
    CardShadowColor["COLOR1"] = "color1";
    CardShadowColor["COLOR2"] = "color2";
    CardShadowColor["COLOR3"] = "color3";
    CardShadowColor["COLOR4"] = "color4";
})(CardShadowColor || (CardShadowColor = {}));
let selectedItemsId = [];
class Todo {
    static create(title, description, colorSelection) {
        return __awaiter(this, void 0, void 0, function* () {
            const getTotalItems = this.get();
            const creteItem = {
                title,
                description,
                colorSelection,
                id: `#${(new Date().getMilliseconds() + Math.random() * 15).toFixed(0)}`,
                isSelected: false,
            };
            const addedNewItem = [...getTotalItems, creteItem];
            localStorage.setItem("todoItems", JSON.stringify(addedNewItem));
        });
    }
    static update() { }
    static delete() { }
    static get() {
        return localStorage.getItem("todoItems")
            ? JSON.parse(localStorage.getItem("todoItems"))
            : [];
    }
}
window.onload = () => main();
function main() {
    showTodoItems(Todo.get());
    createBtn === null || createBtn === void 0 ? void 0 : createBtn.addEventListener("click", createHandler);
    editBtn === null || editBtn === void 0 ? void 0 : editBtn.addEventListener("click", markAll);
    deletedBtn.addEventListener("click", deleteItem);
    selectedBtn.addEventListener("click", makeItemSelected);
    unSelectedBtn.addEventListener("click", makeItemUnSelected);
}
//items showing handler--------------------------||
//items showing handler--------------------------||
const showTodoItems = (items, markAll = false) => {
    const noItemsFoundMessage = document.createElement("p");
    if (items.length > 0) {
        itemsContainer.className = "todo-container";
        noItemsFoundMessage.className = "display-none";
        itemsContainer.replaceChildren();
        items.map((item) => {
            const card = document.createElement("div");
            const cardContent = document.createElement("div");
            const title = document.createElement("h1");
            const description = document.createElement("p");
            const checkedSvg = document.createElement("img");
            const unCheckedSvg = document.createElement("img");
            const isSelected = document.createElement("p");
            card.className = `card ${filterShadowClassName(item.colorSelection)}`;
            card.setAttribute("data-id", item.id);
            cardContent.className = "card-content";
            checkedSvg.className = `checkedSvg display-none`;
            unCheckedSvg.className = `unCheckedSvg ${!markAll && "display-none"}`;
            isSelected.className = "isSelected";
            title.innerText = item.title;
            description.innerText = item.description;
            isSelected.innerText = `${item.isSelected ? "Selected" : "UnSelected"}`;
            checkedSvg.src =
                "https://img.icons8.com/windows/32/000000/checked-checkbox--v1.png";
            unCheckedSvg.src =
                "https://img.icons8.com/fluency-systems-regular/48/000000/unchecked-checkbox.png";
            cardContent.append(title);
            cardContent.append(description);
            card.append(isSelected);
            card.append(unCheckedSvg);
            card.append(checkedSvg);
            card.append(cardContent);
            itemsContainer.append(card);
            //items select checkbox handler--------------------------||
            checkedSvg.onclick = () => {
                checkedSvg.className = `checkedSvg display-none`;
                unCheckedSvg.className = `unCheckedSvg`;
                const itemsIds = selectedItemsId.filter((itm) => itm !== card.dataset.id);
                selectedItemsId = itemsIds;
                isShowActionContainer(selectedItemsId);
            };
            unCheckedSvg.onclick = () => {
                checkedSvg.className = `checkedSvg`;
                unCheckedSvg.className = `unCheckedSvg display-none`;
                selectedItemsId.push(card.dataset.id);
                isShowActionContainer(selectedItemsId);
            };
        });
    }
    else {
        itemsContainer.replaceChildren();
        itemsContainer.className = "";
        noItemsFoundMessage.className = "no-items-found";
        noItemsFoundMessage.innerText = "No items found";
        itemsContainer.append(noItemsFoundMessage);
    }
};
//error handler--------------------------||
//error handler--------------------------||
function createErrorMessage(message) {
    errorTag.innerText = message;
    setTimeout(() => {
        errorTag.innerText = "";
    }, 5000);
}
//filter shadow color-----------||
//filter shadow color-----------||
function filterShadowClassName(color) {
    if (color.toLowerCase() === CardShadowColor.COLOR1.toLowerCase()) {
        return "shadow-color1";
    }
    if (color.toLowerCase() === CardShadowColor.COLOR2.toLowerCase()) {
        return "shadow-color2";
    }
    if (color.toLowerCase() === CardShadowColor.COLOR3.toLowerCase()) {
        return "shadow-color3";
    }
    if (color.toLowerCase() === CardShadowColor.COLOR4.toLowerCase()) {
        return "shadow-color4";
    }
    if (color === "none") {
        return "shadow-default";
    }
}
//crud create handler--------------------------||
//crud create handler--------------------------||
function createHandler() {
    if (!title.value.trim())
        return createErrorMessage("Please enter a title");
    if (!description.value.trim())
        return createErrorMessage("Please enter a description");
    Todo.create(title.value.trim(), description.value.trim(), colorSelection.value);
    title.value = "";
    description.value = "";
    //after create a new items re render the showTodoItems
    showTodoItems(Todo.get());
}
//isShowActionContainer handler--------------------------||
//isShowActionContainer handler--------------------------||
function isShowActionContainer(itemsId) {
    if (itemsId.length > 0) {
        editActionContainer.className = "display-block";
    }
    else {
        editActionContainer.className = "display-none";
    }
}
//markAll-------------------||
//markAll-------------------||
function markAll() {
    const getAttribute = editBtn.getAttribute("data-isActivated");
    if (getAttribute === "false") {
        editBtn.setAttribute("data-isActivated", "true");
        showTodoItems(Todo.get(), true);
    }
    else if (getAttribute === "true") {
        editBtn.setAttribute("data-isActivated", "false");
        showTodoItems(Todo.get(), false);
    }
}
//close mark------------||
//close mark------------||
function closeMarkAll() {
    editBtn.setAttribute("data-isActivated", "false");
    showTodoItems(Todo.get(), false);
}
//make item selected-------------------||
//make item selected-------------------||
function makeItemSelected() {
    selectedItemsId.map((id) => {
        const findIndex = Todo.get().findIndex((itm) => itm.id === id);
        const newArray = Todo.get();
        newArray[findIndex].isSelected = true;
        localStorage.setItem("todoItems", JSON.stringify(newArray));
        showTodoItems(Todo.get());
        isShowActionContainer((selectedItemsId = []));
        closeMarkAll();
    });
}
//make items unSelected------------|
//make items unSelected------------|
function makeItemUnSelected() {
    selectedItemsId.map((id) => {
        const findIndex = Todo.get().findIndex((itm) => itm.id === id);
        const newArray = Todo.get();
        newArray[findIndex].isSelected = false;
        localStorage.setItem("todoItems", JSON.stringify(newArray));
        showTodoItems(Todo.get());
        isShowActionContainer((selectedItemsId = []));
        closeMarkAll();
    });
}
//items deleted------------|
//items deleted------------|
function deleteItem() {
    selectedItemsId.map((id) => {
        const afterRemoved = Todo.get().filter((itm) => itm.id !== id);
        localStorage.setItem("todoItems", JSON.stringify(afterRemoved));
        showTodoItems(Todo.get(), true);
        isShowActionContainer((selectedItemsId = []));
    });
}
