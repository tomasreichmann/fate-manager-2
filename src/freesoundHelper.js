const token = 'biQNMP2u2wH4UOZyz1zZGIk8UWWApipFL00TWzEc';

const apiUrl = 'http://www.freesound.org/apiv2';

const uris = {
  textSearch: apiUrl + '/search/text/'
};

function makeParamString(params = {}) {
  return Object.keys(params).length ? ('?' + Object.keys(params).map( (key) => ( key + '=' + params[key] )).join('&')) : '';
}

export default function searchSound(query) {
  const uri = uris.textSearch + makeParamString({query, token, fields: 'id,name,previews'});
  console.log('searchSound uri', uri);
  return fetch( uri ).then(
    (response) => ( response.json() )
  );
}

export { searchSound };
