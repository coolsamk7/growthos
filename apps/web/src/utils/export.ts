export function downloadFile( content: string, filename: string, mimeType: string = 'text/plain' ) {
    const blob = new Blob( [ content ], { type: mimeType } );
    const url = URL.createObjectURL( blob );
    const link = document.createElement( 'a' );
    link.href = url;
    link.download = filename;
    document.body.appendChild( link );
    link.click();
    document.body.removeChild( link );
    URL.revokeObjectURL( url );
}

export function formatDateForExport( date: string | Date ): string {
    const d = typeof date === 'string' ? new Date( date ) : date;
    return d.toISOString().split( 'T' )[0];
}

export function escapeCSVField( field: any ): string {
    if ( field === null || field === undefined ) return '';
    
    const str = String( field );
    
    // If field contains comma, newline, or quotes, wrap in quotes and escape existing quotes
    if ( str.includes( ',' ) || str.includes( '\n' ) || str.includes( '"' ) ) {
        return `"${str.replace( /"/g, '""' )}"`;
    }
    
    return str;
}
