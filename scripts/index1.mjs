import * as pagefind from "pagefind";
import {readFileSync} from 'node:fs';

const data = JSON.parse(readFileSync('./data/colllist.json'));

// Create a Pagefind search index to work with
const { index } = await pagefind.createIndex();

for(let item of data.items.toSorted((a, b) => {
  const valueA = a.label.toUpperCase();
  const valueB = b.label.toUpperCase();
  if ( valueA < valueB ) { return -1 ; }
  if ( valueA > valueB ) { return 1; }
  return 0;
})) {
  let content = [];
  content.push(item.collid);
  content.push(`<h1>${item.label}</h1>`);
  content.push(item.description);

  let filters = {};
  item.hlbcategories.forEach((cat) => {
    if ( filters[cat[0]] == undefined ) {
      filters[cat[0]] = [];
    }
    filters[cat[0]].push(cat[1]);
  })

  await index.addCustomRecord({
    url: `#${item.collid}`,
    content: content.join("\n"),
    language: 'en',
    meta: {
      title: item.label,
      collid: item.collid,
    },
    filters: filters,
  })
}


console.log("-30-");