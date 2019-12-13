export default function getBeers(filterText) {
  filterText = filterText ? filterText.replace(" ", "_") : "";

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", `https://api.punkapi.com/v2/beers?beer_name=${filterText}`);
    xhr.send();

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        setTimeout(
          resolve(
            JSON.parse(xhr.response).sort((a, b) => {
              if (a.name > b.name) return 1;
              if (a.name < b.name) return -1;
            })
          ),
          2000
        );
      } else {
        reject();
      }
    };
  });
}
