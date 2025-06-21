'use client'
import Navigation from '../badminton/ui-components/Navigation'

import React from 'react';

const TallyFormPage = () => {
  const tallyEmbedCode = `
    <!-- Paste your Tally embed code here, including script tags or iframes -->
    <iframe data-tally-src="https://tally.so/embed/mBqg7N?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1" loading="lazy" width="100%" height="977" frameborder="0" marginheight="0" marginwidth="0" title="Need your expert opinion 🤔"></iframe>
    <script>var d=document,w="https://tally.so/widgets/embed.js",v=function(){"undefined"!=typeof Tally?Tally.loadEmbeds():d.querySelectorAll("iframe[data-tally-src]:not([src])").forEach((function(e){e.src=e.dataset.tallySrc}))};if("undefined"!=typeof Tally)v();else if(d.querySelector('script[src="'+w+'"]')==null){var s=d.createElement("script");s.src=w,s.onload=v,s.onerror=v,d.body.appendChild(s);}</script>
  `;

  const navigation = [
        { name: 'Feedback Form', href: '#', current: true },
        { name: 'Home', href: '/', current: false }
    ]

  return (
    <div className="min-h-full print:block">
        <Navigation navigation={navigation} />
        <main>
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <div dangerouslySetInnerHTML={{ __html: tallyEmbedCode }} />
            </div>
        </main>
    </div>
  );
};

export default TallyFormPage;
