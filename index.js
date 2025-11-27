  (function () {
    const openBtn = document.getElementById('openCreateRoomBtn');
    const form = document.getElementById('createRoomForm');
    const cancelBtn = document.getElementById('cancelCreateRoom');
    const roomType = document.getElementById('roomType');
    const passwordRow = document.getElementById('passwordRow');
    const alertBox = document.getElementById('createRoomAlert');

    // toggle form visibility
    openBtn.addEventListener('click', () => {
      const shown = form.style.display === 'block';
      form.style.display = shown ? 'none' : 'block';
      form.setAttribute('aria-hidden', shown ? 'true' : 'false');
      if (!shown) document.getElementById('roomName').focus();
    });

    cancelBtn.addEventListener('click', () => {
      resetForm();
      form.style.display = 'none';
      form.setAttribute('aria-hidden', 'true');
    });

    // show/hide password input when private selected
    roomType.addEventListener('change', () => {
      if (roomType.value === 'private') {
        passwordRow.style.display = 'block';
      } else {
        passwordRow.style.display = 'none';
        document.getElementById('roomPassword').value = '';
      }
    });

    // basic validation helpers
    function validateName(name) {
      return name && name.trim().length >= 3 && name.trim().length <= 60;
    }

    function showAlert(message, type = 'success') {
      alertBox.style.display = 'block';
      alertBox.className = 'alert ' + (type === 'success' ? 'alert-success' : 'alert-danger');
      alertBox.textContent = message;
    }

    function resetForm() {
      form.reset();
      alertBox.style.display = 'none';
      Array.from(form.querySelectorAll('.is-invalid')).forEach(el => el.classList.remove('is-invalid'));
    }

    // form submit handler
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // gather values
      const nameEl = document.getElementById('roomName');
      const topicEl = document.getElementById('roomTopic');
      const descEl = document.getElementById('roomDescription');
      const passwordEl = document.getElementById('roomPassword');
      const tagsEl = document.getElementById('roomTags');
      const maxEl = document.getElementById('maxParticipants');

      const name = nameEl.value.trim();
      const topic = topicEl.value.trim();
      const description = descEl.value.trim();
      const type = roomType.value;
      const password = passwordEl.value;
      const tags = tagsEl.value.split(',').map(t => t.trim()).filter(Boolean);
      const maxParticipants = parseInt(maxEl.value, 10) || 50;

      // clear previous invalid states
      nameEl.classList.remove('is-invalid');

      // validation
      let invalid = false;
      if (!validateName(name)) {
        nameEl.classList.add('is-invalid');
        invalid = true;
      }
      if (type === 'private' && (!password || password.length < 4)) {
        passwordEl.classList.add('is-invalid');
        showAlert('Private rooms require a password of at least 4 characters.', 'danger');
        invalid = true;
      }

      if (invalid) {
        return;
      }

      // build payload
      const payload = {
        name: name.startsWith('#') ? name : '#' + name.replace(/\s+/g, '-'),
        topic,
        description,
        type,
        password: type === 'private' ? password : null,
        tags,
        maxParticipants,
        createdAt: new Date().toISOString()
      };


        showAlert('Creating room...', 'success');


        await new Promise(r => setTimeout(r, 700));

        showAlert('Room created: ' + payload.name + '. It is now visible in the chat list.', 'success');

        const roomsContainer = document.querySelector('.chat-rooms') || createRoomsContainer();
        const a = document.createElement('a');
        a.className = 'room-link';
        a.href = '#';
        a.textContent = payload.name + (payload.topic ? ' — ' + payload.topic : '');
        roomsContainer.prepend(a);

        resetForm();
        form.style.display = 'none';
    });

    // helper to create rooms container if not present
    function createRoomsContainer() {
      const container = document.createElement('div');
      container.className = 'chat-rooms d-flex flex-wrap gap-3 mt-4';
      // insert before the form
      const parent = document.getElementById('createRoomContainer');
      parent.insertBefore(container, form);
      return container;
    }
  })();

