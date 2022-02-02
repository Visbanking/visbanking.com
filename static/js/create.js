document.querySelector("input#image").addEventListener("change", (event) => {
    const [file] = event.target.files;
    if (file) {
        document.querySelector("img").src = URL.createObjectURL(file);
    } else {
        document.querySelector("img").src = '';
    }
})

document.querySelector("textarea").addEventListener("input", (event) => {
    if (event.target.value !== "") {
        document.querySelector("input#bodyFile").disabled = true;
        document.querySelector("input#bodyFile").title = 'Clear the \'BODY\' section to upload file';
    } else {
        document.querySelector("input#bodyFile").disabled = false;
        document.querySelector("input#bodyFile").title = 'Choose file to upload';
        document.querySelector("input#bodyFile").value = '';
    }
});

document.querySelector("input#bodyFile").addEventListener("change", async (event) => {
    const text = await event.target.files[0].text();
    document.querySelector("textarea").value = text;
    document.querySelector("input#bodyFile").disabled = true;
    document.querySelector("input#bodyFile").title = 'Clear the \'BODY\' section to upload file';   
});