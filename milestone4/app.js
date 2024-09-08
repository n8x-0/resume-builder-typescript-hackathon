function select(x) {
    return document.querySelector(x);
}
const resumeForm = select('#createResumeForm');
const addSkillsBtn = select('#add-skills-btn');
const addExpBtn = select('#add-exp-btn');
const addEduBtn = select('#add-edu-btn');
let skillsArr = [];
let experienceArr = [];
let educationArr = [];
const resumeStoredData = localStorage.getItem("currResumeData");
addSkillsBtn.onclick = () => addCapsuleData("#addSkillsInp", skillsArr, "#skill-capsules-cont", ".skillsErrorBox");
addExpBtn.onclick = () => addCapsuleData('#addExpInp', experienceArr, "#exp-capsules-cont", ".expErrorBox");
addEduBtn.onclick = () => addCapsuleData('#addEduInp', educationArr, "#edu-capsules-cont", ".eduErrorBox");
const addCapsuleData = (inpElem, arr, showToElem, errorBox) => {
    const elem = select(inpElem);
    if (elem.value === '') {
        select(errorBox).innerHTML = `<p class="text-red-500">Field is empty*</p>`;
        return;
    }
    if (arr.length > 9) {
        select(errorBox).innerHTML = `<p class="text-red-500">Maximum limit is 10*</p>`;
        return;
    }
    select(errorBox).innerHTML = '';
    arr.push(elem.value);
    updateCapsuleDisplay(arr, showToElem);
    elem.value = '';
};
const updateCapsuleDisplay = (arr, showToElem) => {
    let clutter = '';
    arr.forEach((data, index) => {
        clutter += `<span>
                      ${data}
                      <i class="fa-solid fa-trash" style="color: #f0f5ff; padding-left:6px" data-index="${index}"></i>
                    </span>`;
    });
    select(showToElem).innerHTML = clutter;
};
document.addEventListener('click', (e) => {
    const target = e.target;
    if (target.classList.contains('fa-trash')) {
        const index = target.getAttribute('data-index');
        const showToElem = target.closest('div')?.getAttribute('id');
        if (showToElem === 'skill-capsules-cont') {
            skillsArr.splice(Number(index), 1);
            updateCapsuleDisplay(skillsArr, `#${showToElem}`);
        }
        else if (showToElem === 'exp-capsules-cont') {
            experienceArr.splice(Number(index), 1);
            updateCapsuleDisplay(experienceArr, `#${showToElem}`);
        }
        else if (showToElem === 'edu-capsules-cont') {
            educationArr.splice(Number(index), 1);
            updateCapsuleDisplay(educationArr, `#${showToElem}`);
        }
    }
});
const imageInput = select('#imageInput');
const imagePreview = select('#imagePreview');
imageInput.onclick = () => handleUploadImage();
imagePreview.onclick = () => handleUploadImage(imageInput);
const handleUploadImage = (imgInp) => {
    imgInp?.click();
    imageInput.addEventListener('change', function () {
        const file = imageInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                imagePreview.innerHTML = `<img src="${e.target.result}" class="object-cover w-full h-full" alt="Image Preview">`;
                select("#print-image-cont").innerHTML = `<img src="${e.target.result}" class="object-cover w-full h-full" alt="Image Preview">`;
            };
            reader.readAsDataURL(file);
        }
        else {
            imagePreview.innerHTML = 'Image Preview';
        }
    });
};
resumeForm.onsubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const { username, contact, email, objective, summary } = form;
    const cvData = {
        username: username.value,
        contact: contact.value,
        email: email.value,
        objective: objective.value,
        skills: skillsArr,
        experience: experienceArr,
        education: educationArr,
        summary: summary.value
    };
    handleCvData(cvData);
    if (resumeStoredData) {
        localStorage.removeItem("currResumeData");
    }
    else {
        localStorage.setItem("currResumeData", JSON.stringify(cvData));
    }
    [username, contact, email, objective, summary].forEach((field) => field.value = '');
    print();
};
const listAddHelper = (listOf, addTo) => {
    let clutter = ``;
    listOf.forEach((data) => {
        clutter += `<li class="mx-6">${data}</li>`;
    });
    select(addTo).innerHTML = clutter;
};
const editPrintBtnCont = select("#editPrintBtnCont");
const handleCvData = (data) => {
    select("#print-username").innerText = data.username;
    select("#print-contact").innerText = data.contact;
    select("#print-email").innerText = data.email;
    select("#print-objective").innerText = data.objective;
    select("#print-summary").innerText = data.summary;
    listAddHelper(data.skills, "#print-skills-list");
    listAddHelper(data.experience, "#print-exp-list");
    listAddHelper(data.education, "#print-edu-list");
    if (data) {
        editPrintBtnCont.classList.remove('hidden');
        const editResumeBtn = select('#editResumeBtn');
        const printResumeBtn = select('#printResumeBtn');
        editResumeBtn.onclick = () => {
            select("#editPreview").setAttribute("contentEditable", "true");
        };
        printResumeBtn.onclick = () => {
            print();
            select("#editPreview").removeAttribute("contentEditable");
        };
    }
};
const createNewResumeBtn = select('#createNewResumeBtn');
createNewResumeBtn.onclick = () => {
    localStorage.removeItem("currResumeItem");
    editPrintBtnCont.classList.add('hidden');
    // window.location.href = '#input-resume-data';
};
if (resumeStoredData) {
    select("#viewResumeButton").setAttribute("href", "#print-content");
    handleCvData(JSON.parse(resumeStoredData));
}
else {
    select("#viewResumeButton").setAttribute("href", "#input-resume-data");
}
export {};
