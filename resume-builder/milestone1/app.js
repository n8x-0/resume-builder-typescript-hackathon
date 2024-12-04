function select(x) {
    return document.querySelector(x);
}
const addSkillsBtn = select('#add-skills-btn');
const addExpBtn = select('#add-exp-btn');
const addEduBtn = select('#add-edu-btn');
let skillsArr = [];
let experienceArr = [];
let educationArr = [];
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
export {};
