const notesContainer = document.getElementById("notes-container");
const newNoteBtn = document.getElementById("new-note-btn");
const noteModal = document.getElementById("note-modal");
const noteTitle = document.getElementById("note-title");
const noteBody = document.getElementById("note-body");
const saveNoteBtn = document.getElementById("save-note-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const sortOptions = document.getElementById("sort-options");
const noteCategory = document.getElementById("note-category");
const filterCategory = document.getElementById("filter-category");


let notes = JSON.parse(localStorage.getItem("notes")) || [];
let editNoteId = null;

function renderNotes() {
   notesContainer.innerHTML = "";

  // Filter notes by selected category (case-insensitive)
  const selectedCategory = filterCategory.value.toLowerCase();
  let filteredNotes = notes;

  if (selectedCategory !== "all") {
    filteredNotes = notes.filter(note =>
      (note.category || "").toLowerCase() === selectedCategory
    );
  }

  // Sort notes
  const sortedNotes = filteredNotes
  .sort((a, b) => b.date - a.date)
  .sort((a, b) => (b.starred === true) - (a.starred === true)); // Starred first



  // Render each note
  sortedNotes.forEach((note, index) => {
    const noteEl = document.createElement("div");
  noteEl.className = "note";
  
    noteEl.innerHTML = `
  <div class="note-header">
    <strong>${note.title}</strong>
    <span class="star-btn" onclick="toggleStar(${index}, event)">
      ${note.starred ? '⭐' : '☆'}
    </span>
  </div>
  <p>${note.body}</p>
  <small>📂 ${note.category ? note.category.charAt(0).toUpperCase() + note.category.slice(1) : 'Uncategorized'}</small><br/>
  <button class="delete-btn" onclick="deleteNote(${index}, event)">Delete</button>
`;
    noteEl.addEventListener("click", (e) => {
      if (!e.target.classList.contains("delete-btn")) openModal(index);
    });
    notesContainer.appendChild(noteEl);
  });

  // Update category filter dropdown
  updateCategoryFilter();
}

function updateCategoryFilter() {
  const categories = [...new Set(notes.map(note => note.category).filter(Boolean))];
  filterCategory.innerHTML = `<option value="all">All Categories</option>`;
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    filterCategory.appendChild(option);
  });
}


function openModal(index = null) {
  editNoteId = index;
  if (index !== null) {
    noteTitle.value = notes[index].title;
    noteBody.value = notes[index].body;
    noteCategory.value = notes[index].category || "";
  } else {
    noteTitle.value = "";
    noteBody.value = "";
    noteCategory.value = "";
  }
  noteModal.classList.remove("hidden");
}


function closeModal() {
  noteModal.classList.add("hidden");
  editNoteId = null;
}

function saveNote() {
  const title = noteTitle.value.trim();
  const body = noteBody.value.trim();
  const category = noteCategory.value.trim().toLowerCase();


  if (!title || !body) return;

  const newNote = {
    title,
    body,
    category,
    date: Date.now(),
    starred: editNoteId !== null ? notes[editNoteId].starred : false
  };

  if (editNoteId !== null) {
    notes[editNoteId] = newNote;
  } else {
    notes.push(newNote);
  }

  localStorage.setItem("notes", JSON.stringify(notes));
  renderNotes();
  closeModal();
}

function deleteNote(index) {
  if (confirm("Delete this note?")) {
    notes.splice(index, 1);
    localStorage.setItem("notes", JSON.stringify(notes));
    renderNotes();
  }
}
function toggleStar(index, event) {
  event.stopPropagation(); // Prevent modal from opening
  notes[index].starred = !notes[index].starred;
  localStorage.setItem("notes", JSON.stringify(notes));
  renderNotes();
}


newNoteBtn.addEventListener("click", () => openModal());
saveNoteBtn.addEventListener("click", saveNote);
closeModalBtn.addEventListener("click", closeModal);
sortOptions.addEventListener("change", renderNotes);
filterCategory.addEventListener("change", renderNotes);



renderNotes();
