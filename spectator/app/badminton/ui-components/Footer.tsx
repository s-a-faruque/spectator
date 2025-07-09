import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-center py-4">
      {/* <p className="text-sm text-gray-500">© {new Date().getFullYear()} WTS</p> */}
      <p className="text-sm text-gray-500">
        <strong>WTS / </strong> What&apos;s The Score
        <button
          className='pl-4 ml-4 bg-gray-100 hover:bg-gray-600 font-semibold py-2 px-4 rounded'
          onClick={() => {
            window.location.assign(`/feedback`);
          }}
        >
          Feedback Please! <span role="img" aria-label="smile">😊</span>
        </button> 
        <a className="about" href="https://coff.ee/safique" target="_blank">
					☕
				</a>
      </p>
    </footer>
  );
}