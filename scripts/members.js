import { environment } from './environment.js';

loadMembers();

const membersContainer = document.getElementById('members-content');

async function loadMembers() {
  const resp = await fetch(`${environment.serverUrls.http}/users/chatters`);
  updateMembers(await resp.json());
}

function updateMembers(members) {
  console.log(members);
  membersContainer.innerHTML = '';
  for (const member of members) {
    const memberElement = document.createElement('div');
    memberElement.classList.add('member');
    const avatarElement = document.createElement('img');
    avatarElement.setAttribute('src', member.image);
    memberElement.appendChild(avatarElement);
    const nameElement = document.createElement('span');
    nameElement.innerHTML = member.login;
    memberElement.appendChild(nameElement);
    membersContainer.appendChild(memberElement);
  }
}
