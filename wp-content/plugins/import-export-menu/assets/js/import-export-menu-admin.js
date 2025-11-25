/* global ajaxObject, swal */
( function( $ ) {
	'use strict';

	// Add event listener Export.
	$( '.toplevel_page_import-export-menu .wrap button.export' ).on( 'click', function() {
		// Perform an AJAX request to the server.
		$.ajax( {
			url: ajaxObject.ajaxUrl,
			type: 'POST',
			data: {
				action: 'action-get-export',
				nonce: ajaxObject.nonce,
			},
			success( response ) {
				// Callback when request is successful.
				if ( response.success ) {
					// Convert JSON data to string.
					const jsonData = JSON.stringify( response.data );

					// Create JSON blob.
					const blob = new Blob( [ jsonData ], { type: 'application/json' } );

					// Create object URL from blob.
					const url = URL.createObjectURL( blob );

					// Create <a> element to download JSON file.
					const a = document.createElement( 'a' );
					a.href = url;
					a.download = 'import-export-menu.json';
					document.body.appendChild( a );
					a.click();
					document.body.removeChild( a );

					// Clean up object URL.
					URL.revokeObjectURL( url );
				} else {
					swal( {
						title: 'Error!',
						text: response.data.message,
						icon: 'error',
						dangerMode: true,
					} );
				}
			},
			error() {
				swal( {
					title: 'Upps!',
					text: 'Oops! An error occurred or failed.',
					icon: 'error',
					dangerMode: true,
				} );
			},
		} );
	} );

	// Add event listener Import.
	$( '.toplevel_page_import-export-menu .wrap button.import' ).on( 'click', function( e ) {
		e.preventDefault();

		const fileData = $( '.toplevel_page_import-export-menu .wrap #file-input' ).prop( 'files' )[ 0 ];

		// Check if file data is empty
		if ( ! fileData ) {
			swal( {
				title: 'Error!',
				text: 'No file selected. Please choose a file to import.',
				icon: 'error',
				dangerMode: true,
			} );
			return; // Exit.
		}

		// Check if the file type is JSON (MIME type)
		if ( fileData.type !== 'application/json' ) {
			swal( {
				title: 'Error!',
				text: 'Invalid file type. Please upload a JSON file.',
				icon: 'error',
				dangerMode: true,
			} );
			return; // Exit.
		}

		// Check if the file extension is .json
		if ( ! fileData.name.endsWith( '.json' ) ) {
			swal( {
				title: 'Error!',
				text: 'Invalid file extension. Please upload a .json file.',
				icon: 'error',
				dangerMode: true,
			} );
			return; // Exit.
		}

		// Check if the file size is greater than 5MB
		if ( fileData.size > 5242880 ) { // 5242880 bytes = 5MB
			swal( {
				title: 'Error!',
				text: 'File size exceeds 5MB. Please upload a smaller file.',
				icon: 'error',
				dangerMode: true,
			} );
			return; // Exit.
		}

		const formData = new FormData();
		formData.append( 'file', fileData );
		formData.append( 'action', 'action-get-import' );
		formData.append( 'nonce', ajaxObject.nonce );

		// Active loader.
		$( '.wrap .loader' ).css( 'display', 'flex' );

		$.ajax( {
			url: ajaxObject.ajaxUrl,
			type: 'POST',
			contentType: false,
			processData: false,
			data: formData,
			success( response ) {
				// Deactive loader.
				$( '.wrap .loader' ).css( 'display', 'none' );
				if ( response.success ) {
					swal( {
						title: 'Success!',
						text: response.data.message,
						icon: 'success',
						dangerMode: false,
					} );
				} else {
					swal( {
						title: 'Error!',
						text: response.data.message,
						icon: 'error',
						dangerMode: true,
					} );
				}
			},
			error() {
				// Deactive loader.
				$( '.wrap .loader' ).css( 'display', 'none' );
				swal( {
					title: 'Upps!',
					text: 'Oops! An error occurred or failed.',
					icon: 'error',
					dangerMode: true,
				} );
			},
		} );
	} );
}( jQuery ) );
