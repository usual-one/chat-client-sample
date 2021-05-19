import { environment } from './environment.js';
import { createElement } from './html-utils.js';

loadMembers();

const membersContainer = document.getElementById('members-content');

async function loadMembers() {
  const resp = await fetch(`${environment.serverUrls.http}/users/chatters`);
  updateMembers(await resp.json());
  setTimeout(loadMembers, 10000);
}

function updateMembers(members) {
  membersContainer.innerHTML = '';
  for (const member of members) {
    const memberElement = createElement('div', ['member']);

    const avatarElement = createElement('img', [], { src: member.image });
    memberElement.appendChild(avatarElement);

    const nameElement = createElement('span');
    nameElement.innerHTML = member.login;
    memberElement.appendChild(nameElement);

    membersContainer.appendChild(memberElement);
  }
}
