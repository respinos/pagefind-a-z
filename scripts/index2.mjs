import * as pagefind from "pagefind";
import {readFileSync} from 'node:fs';

const data = JSON.parse(readFileSync('./data/colllist.json'));

// Create a Pagefind search index to work with
const { index } = await pagefind.createIndex();

data.items.sort((a, b) => {
  const valueA = a.label.toUpperCase();
  const valueB = b.label.toUpperCase();
  if ( valueA < valueB ) { return -1 ; }
  if ( valueA > valueB ) { return 1; }
  return 0;
})
for(let item of data.items) {
  let content = [`<html lang="en"><head>`];
  content.push(`<meta data-pagefind-meta="collid:${item.collid}" />`)
  content.push(`<title>${item.label}</title>`);
  content.push(`</head><body>`);  
  content.push(`<h1>${item.label}</h1>`);
  content.push(`<p>${item.collid}</p>`);
  content.push(`<p>${item.description}</p>`);

  content.push(`<p>`);
  content.push(`<span data-pagefind-filter="Format">${item.class}</span>`);

  if ( item.hlbcategories) {
    item.hlbcategories.forEach((cat) => {
      // filters[cat[0]].push(cat[1]);
      content.push(`<span data-pagefind-filter="${cat[0]}">${cat.at(-1)}</span>`);
      console.log(cat);
    })
  }
  content.push(`</p>`);

  content.push(`</body></html>`);

  await index.addHTMLFile({
    url: `#${item.collid}`,
    content: content.join("\n"),
  });
}

await index.writeFiles({
  outputPath: "public/pagefind",
})


console.log("-30-");