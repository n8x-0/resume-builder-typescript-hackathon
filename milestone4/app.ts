function select(x: string) {
    return document.querySelector(x) as HTMLElement;
}

interface CVdata {
    id: string,
    username: string;
    contact: string;
    email: string;
    objective: string;
    skills: string[],
    experience: string[],
    education: string[],
    summary: string
}
const defaultResume: CVdata = {
    id: '',
    username: "Demo Username",
    contact: "+9012569845645",
    email: "your@mail.com",
    objective: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aperiam dolorem, ipsum illum quas rem voluptate praesentium.",
    skills: ["Frontenf Engineer", "Teacher", "Example skills"],
    experience: ["4 years of experience as a lean web developer at iBcd.", "2 years of edititng experience using Adobe after effects", "your experiences goes here"],
    education: ["BS in etc in year 2059", "Cerification in GIAIC GenAI", "Your education goes here"],
    summary: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi cumque tempore vitae modi quidem cum eligendi quas. At tempore."
}

const resumeForm = select('#createResumeForm')
const addSkillsBtn = select('#add-skills-btn');
const addExpBtn = select('#add-exp-btn');
const addEduBtn = select('#add-edu-btn');

let skillsArr: string[] = [];
let experienceArr: string[] = [];
let educationArr: string[] = [];
let createdResList: CVdata[] = [];

const storedResArr: any = localStorage.getItem("createdResList");
const storedResList = JSON.parse(storedResArr)

addSkillsBtn.onclick = () => addCapsuleData("#addSkillsInp", skillsArr, "#skill-capsules-cont", ".skillsErrorBox");
addExpBtn.onclick = () => addCapsuleData('#addExpInp', experienceArr, "#exp-capsules-cont", ".expErrorBox");
addEduBtn.onclick = () => addCapsuleData('#addEduInp', educationArr, "#edu-capsules-cont", ".eduErrorBox");

const addCapsuleData = (inpElem: string, arr: string[], showToElem: string, errorBox: string) => {
    const elem = select(inpElem) as HTMLInputElement;

    if (elem.value === '') {
        select(errorBox).innerHTML = `<p style="color: red">Field is empty*</p>`;
        return;
    }
    if (arr.length > 9) {
        select(errorBox).innerHTML = `<p style="color: red">Maximum limit is 10*</p>`;
        return;
    }

    select(errorBox).innerHTML = '';
    arr.push(elem.value);

    updateCapsuleDisplay(arr, showToElem);
    elem.value = '';
};

const updateCapsuleDisplay = (arr: string[], showToElem: string) => {
    let clutter = '';
    arr.forEach((data, index) => {
        clutter += `<span>
                      ${data}
                      <i class="fa-solid fa-trash" style="color: #f0f5ff; padding-left:6px" data-index="${index}"></i>
                    </span>`;
    });
    select(showToElem).innerHTML = `${clutter}<div class="capsule-faded-bottom"></div>`;
};

const updateResumeList = (arr: CVdata[], showToElem: string) => {
    let clutter = '';
    arr.forEach((data, index) => {
        clutter += `<div class="res-cards">
                        <div>
                            <div class="imgBox"><img
                                    src="https://i.pinimg.com/736x/58/51/2e/58512eb4e598b5ea4e2414e3c115bef9.jpg"
                                    alt=""></div>
                            <p>${data.username}</p>
                        </div>
                        <i class="fa-solid fa-trash" style="color: #3b82f6; padding-left:6px" data-index="${index}"></i>
                    </div> `;
    });
    select(showToElem).innerHTML = clutter;
}

document.addEventListener('click', (e: Event) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('fa-trash')) {
        const index = target.getAttribute('data-index');
        const showToElem = target.closest('div')?.getAttribute('id');

        if (showToElem === 'skill-capsules-cont') {
            skillsArr.splice(Number(index), 1);
            updateCapsuleDisplay(skillsArr, `#${showToElem}`);
        } else if (showToElem === 'exp-capsules-cont') {
            experienceArr.splice(Number(index), 1);
            updateCapsuleDisplay(experienceArr, `#${showToElem}`);
        } else if (showToElem === 'edu-capsules-cont') {
            educationArr.splice(Number(index), 1);
            updateCapsuleDisplay(educationArr, `#${showToElem}`);
        } else if (target.closest('.created-resume-list')) {
            storedResList.splice(Number(index), 1);
            createdResList = storedResList;
            localStorage.setItem("createdResList", JSON.stringify(createdResList))
            updateResumeList(storedResList, `.created-resume-list`);
        }
    }
});


const imageInput: any = select('#imageInput');
const imagePreview = select('#imagePreview');

imageInput.onclick = () => handleUploadImage()
imagePreview.onclick = () => handleUploadImage(imageInput)

const handleUploadImage = (imgInp?: HTMLElement) => {
    imgInp?.click();
    imageInput.addEventListener('change', function () {
        const file = imageInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e: any) {
                imagePreview.innerHTML = `<img src="${e.target.result}" class="object-cover w-full h-full" alt="Image Preview">`;
                select("#print-image-cont").innerHTML = `<img src="${e.target.result}" class="object-cover w-full h-full" alt="Image Preview">`;
            };
            reader.readAsDataURL(file);
        } else {
            imagePreview.innerHTML = 'Image Preview';
        }
    });
}

resumeForm.onsubmit = (e: SubmitEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement;
    const { username, contact, email, objective, summary } = form;

    const uniqueID = Math.floor(Date.now()).toString();
    const cvData: CVdata = {
        id: uniqueID,
        username: username.value,
        contact: contact.value,
        email: email.value,
        objective: objective.value,
        skills: skillsArr,
        experience: experienceArr,
        education: educationArr,
        summary: summary.value
    };

    if (storedResList.length !== 0) {
        storedResList.push(cvData);
        createdResList = storedResArr;
        localStorage.setItem("createdResList", JSON.stringify(createdResList));
        updateResumeList(storedResList, ".created-resume-list")
    } else {
        createdResList.push(cvData)
        localStorage.setItem("createdResList", JSON.stringify(createdResList))
    }
    handleCvData(cvData);

    select("#editNprintBtn-boxToHide").style.display = 'block';
    [username, contact, email, objective, summary].forEach((field: any) => field.value = '');
    select("#skill-capsules-cont").innerHTML = '';
    select("#exp-capsules-cont").innerHTML = '';
    select("#edu-capsules-cont").innerHTML = '';
    print();
}

const listAddHelper = (listOf: string[], addTo: string) => {
    let clutter = ``;
    listOf.forEach((data) => {
        clutter += `<li class="mx-6">${data}</li>`
    })
    select(addTo).innerHTML = clutter
}

const handleCvData = (data: CVdata) => {

    select("#print-username").innerText = data.username;
    select("#print-contact").innerText = data.contact;
    select("#print-email").innerText = data.email;
    select("#print-objective").innerText = data.objective;
    select("#print-summary").innerText = data.summary;

    listAddHelper(data.skills, "#print-skills-list");
    listAddHelper(data.experience, "#print-exp-list");
    listAddHelper(data.education, "#print-edu-list");
}
if (storedResList.length !== 0) {
    select("#viewResumeButton").setAttribute("href", "#print-content");
    select("#editNprintBtn-boxToHide").style.display = 'block';
    handleCvData(storedResList[storedResList.length - 1]);
    updateResumeList(storedResList, ".created-resume-list")
} else {
    select("#viewResumeButton").setAttribute("href", "#input-resume-data")
    select("#editNprintBtn-boxToHide").style.display = 'none';
    handleCvData(defaultResume)
}

const createNewResumeBtn = select('#createNewResumeBtn');
const editResumeBtn = select('#editResumeBtn');
const printResumeBtn = select('#printResumeBtn');

editResumeBtn.onclick = () => {
    select("#editPreview").setAttribute("contentEditable", "true")
}
printResumeBtn.onclick = () => {
    print();
    select("#editPreview").removeAttribute("contentEditable")
}
createNewResumeBtn.onclick = () => {
    window.location.href = '#input-resume-data';
}