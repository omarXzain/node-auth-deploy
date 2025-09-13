const container = document.getElementById("postContainer");

async function fetchPosts() {
  try {
    const response = await fetch("/api/posts");
    const postData = await response.json();

    container.innerHTML = `
      <h2>${postData.title}</h2>
      <p> ${postData.body}</p>
      `;
  } catch (error) {
    console.log(error);
  }
}

fetchPosts();
