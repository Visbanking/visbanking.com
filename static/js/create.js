document.querySelector("input#bodyFile").addEventListener("change", async (event) => {
    const text = await event.target.files[0].text();
    document.querySelector("textarea").value = text;
});