var app = angular.module('app', []);

app.directive('stickyNote', function(socket) {
	var linker = function(scope, element, attrs) {
			element.draggable({
				stop: function(event, ui) {
					socket.emit('moveNote', {
						id: scope.note.id,
						x: ui.position.left,
						y: ui.position.top
					});
				}
			});

			socket.on('onNoteMoved', function(data) {
				// Update if the same note
				if(data.id == scope.note.id) {
					element.animate({ left: data.x, top: data.y });
				}
			});

			// Some DOM initiation to make it nice
			element.css('left', '10px');
			element.css('top', '50px');
			element.hide().fadeIn();
		};

	var controller = function($scope) {
		$scope.updateNote = function(note) {
			socket.emit('updateNote', note);
		};

		$scope.deleteNote = function(id) {
			// Delete remote instances
			socket.emit('deleteNote', { id:id });
			// Delete local instance
			$scope.ondelete({id:id});
		};
	};

	return {
		restrict: 'A',
		link: linker,
		controller: controller,
		scope: { 
			note:'=',
			ondelete:'&'
		}
	};
});

app.factory('socket', function($rootScope) {
	var socket = io.connect('http://192.168.1.109');
	return {
		on: function(eventName, callback) {
			socket.on(eventName, function() {
				var args = arguments;
				$rootScope.$apply(function() {
					callback.apply(socket, args);
				});
			});
		},
		emit: function(eventName, data, callback) {
			socket.emit(eventName, data, function() {
				var args = arguments;
				$rootScope.$apply(function() {
					if(callback) {
						callback.apply(socket, args);
					}
				});
			});
		}
	};
});

var MainCtrl = function($scope, socket) {
		$scope.notes = [];

		// Incoming
		socket.on('onNoteCreated', function(data) {
			$scope.notes.push(data);
		});

		socket.on('onNoteUpdated', function(data) {
			var updatedNote = _.find($scope.notes, function(item) {
				return item.id == data.id;
			});

			if(typeof(updatedNote) != "undefined") {
				updatedNote.title = data.title;
				updatedNote.body = data.body;
			}
		});

		socket.on('onNoteDeleted', function(data) {
			$scope.deleteNote(data.id);
		});		

		// Outgoing
		$scope.createNote = function() {
			var note = {
				id: new Date().getTime(),
				title: 'New Note',
				body: 'Pending'
			};

			$scope.notes.push(note);
			socket.emit('createNote', note);
		};

		$scope.deleteNote = function(id) {
            var oldNotes = $scope.notes,
            	newNotes = [];

            angular.forEach(oldNotes, function (note) {
                if (note.id !== id) newNotes.push(note);
            });

            $scope.notes = newNotes;			
		}
	};