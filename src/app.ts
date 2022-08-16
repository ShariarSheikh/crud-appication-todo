//selectors----------------------------------------------------------------------|
//selectors----------------------------------------------------------------------|
const createBtn = <HTMLButtonElement>document.getElementById("createBtn");
const title = <HTMLInputElement>document.getElementById("title");
const description = <HTMLInputElement>document.getElementById("description");
const editBtn = <HTMLButtonElement>document.getElementById("editBtn");
const colorSelection = <HTMLSelectElement>(
  document.getElementById("colorSelection")
);
const itemsContainer = <HTMLDivElement>(
  document.getElementsByClassName("todo-container")[0]
);
const errorTag = <HTMLParagraphElement>(
  document.getElementsByClassName("errorTag")[0]
);
const editActionContainer = <HTMLDivElement>(
  document.getElementById("editActions")
);
const selectedBtn = <HTMLButtonElement>document.getElementById("selectedBtn");
const unSelectedBtn = <HTMLButtonElement>(
  document.getElementById("unSelectedBtn")
);
const deletedBtn = <HTMLButtonElement>document.getElementById("deletedBtn");

//interface------------------------------------------------|
//interface------------------------------------------------|
interface TodoItems {
  title: string;
  description: string;
  colorSelection: string;
  id: string;
  isSelected: boolean;
}

enum CardShadowColor {
  DEFAULT = "default",
  COLOR1 = "color1",
  COLOR2 = "color2",
  COLOR3 = "color3",
  COLOR4 = "color4",
}

let selectedItemsId: string[] = [];

class Todo {
  public static async create(
    title: string,
    description: string,
    colorSelection: string
  ) {
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
  }
  public static update() {}
  public static delete() {}
  public static get(): TodoItems[] {
    return localStorage.getItem("todoItems")
      ? JSON.parse(localStorage.getItem("todoItems"))
      : [];
  }
}

window.onload = () => main();

function main() {
  showTodoItems(Todo.get());

  createBtn?.addEventListener("click", createHandler);
  editBtn?.addEventListener("click", markAll);
  deletedBtn.addEventListener("click", deleteItem);

  selectedBtn.addEventListener("click", makeItemSelected);
  unSelectedBtn.addEventListener("click", makeItemUnSelected);
}

//items showing handler--------------------------||
//items showing handler--------------------------||
const showTodoItems = (items: TodoItems[], markAll: boolean = false) => {
  const noItemsFoundMessage = document.createElement("p");

  if (items.length > 0) {
    itemsContainer.className = "todo-container";
    noItemsFoundMessage.className = "display-none";
    itemsContainer.replaceChildren();

    items.map((item: TodoItems) => {
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

        const itemsIds = selectedItemsId.filter(
          (itm) => itm !== card.dataset.id
        );
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
  } else {
    itemsContainer.replaceChildren();
    itemsContainer.className = "";
    noItemsFoundMessage.className = "no-items-found";
    noItemsFoundMessage.innerText = "No items found";
    itemsContainer.append(noItemsFoundMessage);
  }
};

//error handler--------------------------||
//error handler--------------------------||
function createErrorMessage(message: string) {
  errorTag.innerText = message;

  setTimeout(() => {
    errorTag.innerText = "";
  }, 5000);
}

//filter shadow color-----------||
//filter shadow color-----------||
function filterShadowClassName(color: string): string {
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
  if (!title.value.trim()) return createErrorMessage("Please enter a title");
  if (!description.value.trim())
    return createErrorMessage("Please enter a description");

  Todo.create(
    title.value.trim(),
    description.value.trim(),
    colorSelection.value
  );

  title.value = "";
  description.value = "";

  //after create a new items re render the showTodoItems
  showTodoItems(Todo.get());
}

//isShowActionContainer handler--------------------------||
//isShowActionContainer handler--------------------------||
function isShowActionContainer(itemsId: string[]) {
  if (itemsId.length > 0) {
    editActionContainer.className = "display-block";
  } else {
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
  } else if (getAttribute === "true") {
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
