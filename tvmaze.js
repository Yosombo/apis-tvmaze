/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */

/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
  // TODO: Make an ajax request to the searchShows api.  Remove
  // hard coded data.
  const res = await axios.get(`http://api.tvmaze.com/search/shows?q=${query}`);
  const shows = [];

  res.data.forEach((e) => {
    if (e.show.image === null) {
      shows.push({
        id: e.show.id,
        name: e.show.name,
        summary: e.show.summary,
        image: 'https://tinyurl.com/tv-missing',
      });
    } else {
      shows.push({
        id: e.show.id,
        name: e.show.name,
        summary: e.show.summary,
        image: e.show.image.medium,
      });
    }
  });
  return shows;
}

/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $('#shows-list');
  $showsList.empty();

  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
           <div class="card-body">
             <img class="card-img-top" src="${show.image}">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <button type="button" class="btn btn-info">Episodes</button>
           </div>
         </div>
       </div>
      `
    );

    $showsList.append($item);
  }
}

/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$('#search-form').on('submit', async function handleSearch(evt) {
  evt.preventDefault();

  let query = $('#search-query').val();
  if (!query) return;

  $('#episodes-area').hide();

  let shows = await searchShows(query);

  populateShows(shows);
});

/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  // TODO: get episodes from tvmaze
  //       you can get this by making GET request to
  //       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes
  const res = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
  // TODO: return array-of-episode-info, as described in docstring above
  const episodes = [];
  res.data.forEach((e) => {
    episodes.push({
      id: e.id,
      name: e.name,
      season: e.season,
      number: e.number,
    });
  });
  console.log(episodes);
  return episodes;
}
$('#shows-list').on('click', '.btn', async function (e) {
  const id = e.target.parentNode.parentNode.dataset.showId;
  const episodes = await getEpisodes(id);
  populateEpisodes(episodes);
  console.log(episodes);
});

function populateEpisodes(episodes) {
  const $episodesList = $('#episodes-list');
  $episodesList.empty();
  $('#episodes-area').show();
  for (let episode of episodes) {
    let $episodeLI = $(
      ` <li><b>${episode.name}</b> (season ${episode.season}, eposode ${episode.number})</li>`
    );
    $episodesList.append($episodeLI);
  }
}
