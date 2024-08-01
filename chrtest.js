const express = require('express');
const bodyParser = require('body-parser');
const CHR = require('chr');

const app = express();


app.use(bodyParser.json());

app.post('/impliedrelationscheck', async (req, res) => {
    const chr = CHR();
    // generalize provided constraints
    chr('all_edge(A,B) ==> all_relation(A,B)');
    chr('any_edge(A,B) ==> any_relation(A,B)');
    
    // avoid drawing same conclusion twice
    chr('all_relation(A,B), all_relation(A,B) <=> all_relation(A,B)');
    chr('any_relation(A,B), any_relation(A,B) <=> any_relation(A,B)');
    // avoid nested terms for easier handling of JSON data
    chr('implied_all_edge(A,B), implied_all_edge(A,B) <=> implied_all_edge(A,B)');
    chr('implied_any_edge(A,B), implied_any_edge(A,B) <=> implied_any_edge(A,B)');
    chr('any_edge_rendered_pointless_by(C, B, A),\
         any_edge_rendered_pointless_by(C, B, A) <=>\
         any_edge_rendered_pointless_by(C, B, A)');
    
    chr('all_relation(A,B), all_relation(B,C) ==>\
         all_relation(A,C), implied_all_edge(A,C)');
    chr('any_relation(A,C), all_relation(B,C) ==>\
         any_relation(A,B), implied_any_edge(A,B)');
    chr('any_relation(A,B), all_relation(A,B), any_relation(C,B) ==>\
         C != A |\
         any_edge_rendered_pointless_by(C, B, A);');

    const initialData = req.body;
    const initialConstraints = initialData.map(({constraint, args}) => {
        console.debug({constraint, args});
        return chr[constraint](...args);
    });
    console.debug(initialConstraints);
    await Promise.all(initialConstraints);
    res.status(200).send(chr.Store.toString());
});

app.listen(3000, () => {
  console.log('Ready to process constraints!');
});
