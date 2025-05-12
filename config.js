export const config = {
    mapsApiKey: 'YOUR_GOOGLE_MAPS_API_KEY', // Add your API key here
    dockLiftMultiplier: 0.4,    // Reduced upward movement intensity
    dockSpread: 1.5,            // Wider spread effect
    dockSize: 48, 
    dockMaxZoom: 1.4,          // Slightly reduced max zoom

    // Root URL for GitHub Pages compatibility
    baseUrl: window.location.pathname.includes('/macos-web') ? '/macos-web' : '',
    
    // Icons for the dock
    dockIcons: [
        { name: "Finder", iconUrl: "https://parsefiles.back4app.com/JPaQcFfEEQ1ePBxbf6wvzkPMEqKYHhPYv8boI1Rc/9e80c50a5802d3b0a7ec66f3fe4ce348_low_res_Finder.png", action: "toggleFinderWindow" },
        { name: "Launchpad", iconUrl: "https://parsefiles.back4app.com/JPaQcFfEEQ1ePBxbf6wvzkPMEqKYHhPYv8boI1Rc/bb6cdfc3456ac1ec1ccf938473dd52aa_low_res_Launchpad.png", action: "toggleLaunchpad" },
        { name: "Safari", iconUrl: "https://parsefiles.back4app.com/JPaQcFfEEQ1ePBxbf6wvzkPMEqKYHhPYv8boI1Rc/8204ffaf2c6f9f46a1a803a96c91e7d5_low_res_Safari.png", action: "openBrowser" },
        { name: "Messages", iconUrl: "https://parsefiles.back4app.com/JPaQcFfEEQ1ePBxbf6wvzkPMEqKYHhPYv8boI1Rc/bb5a4b5042f5dbd01baf9c1697460774_JQL8D8bMM2.png", action: "openMessages" },
        { name: "Photos", iconUrl: "https://parsefiles.back4app.com/JPaQcFfEEQ1ePBxbf6wvzkPMEqKYHhPYv8boI1Rc/c0b761fc19488f0b4d2311f29b71ba01_low_res_Photos.png", action: "openPhotos" },
        { name: "Music", iconUrl: "https://parsefiles.back4app.com/JPaQcFfEEQ1ePBxbf6wvzkPMEqKYHhPYv8boI1Rc/98838a6b1fcba311aa2826f8cb46d7c9_low_res_Music.png", action: "openMusic" },
        { name: "Settings", iconUrl: "https://parsefiles.back4app.com/JPaQcFfEEQ1ePBxbf6wvzkPMEqKYHhPYv8boI1Rc/9b23bcaafd4c81fa40685736c9d2cac1_2DLff7nlvI.png", action: "openSettings" },
        { name: "Instagram", iconUrl: "https://parsefiles.back4app.com/JPaQcFfEEQ1ePBxbf6wvzkPMEqKYHhPYv8boI1Rc/94426dd1ffb079f8b74caad9225be819_low_res_Instagram.png", action: "openInstagram" },
        { name: "Spotify",  iconUrl: "https://parsefiles.back4app.com/JPaQcFfEEQ1ePBxbf6wvzkPMEqKYHhPYv8boI1Rc/992a189bc515c265833d1f0c6556c12c_low_res_Spotify.png", action: "openSpotify" },
        { name: "VSCode",   iconUrl: "https://parsefiles.back4app.com/JPaQcFfEEQ1ePBxbf6wvzkPMEqKYHhPYv8boI1Rc/eb454471770de82ad9e80c8007bb54f6_low_res_VSCode.png", action: "openVSCode" },
        { name: "YouTube",  iconUrl: "https://parsefiles.back4app.com/JPaQcFfEEQ1ePBxbf6wvzkPMEqKYHhPYv8boI1Rc/5207abd97262cc86e31c13fa9f13b774_low_res_YouTube.png", action: "openYoutube" }
    ],
    
    // Icons for the desktop
    desktopIcons: [],
    
    // Icons for Launchpad - using the same icons as dock for now
    launchpadIcons: [
        { name: "Finder", iconUrl: "https://parsefiles.back4app.com/JPaQcFfEEQ1ePBxbf6wvzkPMEqKYHhPYv8boI1Rc/9e80c50a5802d3b0a7ec66f3fe4ce348_low_res_Finder.png", action: "toggleFinderWindow" },
        { name: "Launchpad", iconUrl: "https://parsefiles.back4app.com/JPaQcFfEEQ1ePBxbf6wvzkPMEqKYHhPYv8boI1Rc/bb6cdfc3456ac1ec1ccf938473dd52aa_low_res_Launchpad.png", action: "toggleLaunchpad" },
        { name: "Safari", iconUrl: "https://parsefiles.back4app.com/JPaQcFfEEQ1ePBxbf6wvzkPMEqKYHhPYv8boI1Rc/8204ffaf2c6f9f46a1a803a96c91e7d5_low_res_Safari.png", action: "openBrowser" },
        { name: "Messages", iconUrl: "https://parsefiles.back4app.com/JPaQcFfEEQ1ePBxbf6wvzkPMEqKYHhPYv8boI1Rc/bb5a4b5042f5dbd01baf9c1697460774_JQL8D8bMM2.png", action: "openMessages" },
        { name: "Photos", iconUrl: "https://parsefiles.back4app.com/JPaQcFfEEQ1ePBxbf6wvzkPMEqKYHhPYv8boI1Rc/c0b761fc19488f0b4d2311f29b71ba01_low_res_Photos.png", action: "openPhotos" },
        { name: "Music", iconUrl: "https://parsefiles.back4app.com/JPaQcFfEEQ1ePBxbf6wvzkPMEqKYHhPYv8boI1Rc/98838a6b1fcba311aa2826f8cb46d7c9_low_res_Music.png", action: "openMusic" },
        { name: "Settings", iconUrl: "https://parsefiles.back4app.com/JPaQcFfEEQ1ePBxbf6wvzkPMEqKYHhPYv8boI1Rc/9b23bcaafd4c81fa40685736c9d2cac1_2DLff7nlvI.png", action: "openSettings" },
        { name: "Instagram", iconUrl: "https://parsefiles.back4app.com/JPaQcFfEEQ1ePBxbf6wvzkPMEqKYHhPYv8boI1Rc/94426dd1ffb079f8b74caad9225be819_low_res_Instagram.png", action: "openInstagram" },
        { name: "Spotify",  iconUrl: "https://parsefiles.back4app.com/JPaQcFfEEQ1ePBxbf6wvzkPMEqKYHhPYv8boI1Rc/992a189bc515c265833d1f0c6556c12c_low_res_Spotify.png", action: "openSpotify" },
        { name: "VSCode",   iconUrl: "https://parsefiles.back4app.com/JPaQcFfEEQ1ePBxbf6wvzkPMEqKYHhPYv8boI1Rc/eb454471770de82ad9e80c8007bb54f6_low_res_VSCode.png", action: "openVSCode" },
        { name: "YouTube",  iconUrl: "https://parsefiles.back4app.com/JPaQcFfEEQ1ePBxbf6wvzkPMEqKYHhPYv8boI1Rc/5207abd97262cc86e31c13fa9f13b774_low_res_YouTube.png", action: "openYoutube" }
    ],
    
    // Files for the Finder window
    finderFiles: [
        { name: "Documents", iconUrl: "https://macosicons.com/api/icons/Documents_macOS_Big_Sur/auto", type: "folder" },
        { name: "Downloads", iconUrl: "https://macosicons.com/api/icons/Downloads_macOS_Big_Sur/auto", type: "folder" },
        { name: "Pictures", iconUrl: "https://macosicons.com/api/icons/Pictures_macOS_Big_Sur/auto", type: "folder" },
        { name: "Music", iconUrl: "https://macosicons.com/api/icons/Music_macOS_Big_Sur/auto", type: "folder" },
        { name: "Project.pdf", iconUrl: "https://macosicons.com/api/icons/Adobe%20Acrobat_macOS_Big_Sur/auto", type: "file" },
        { name: "Budget.xlsx", iconUrl: "https://macosicons.com/api/icons/Microsoft%20Excel_macOS_Big_Sur/auto", type: "file" },
        { name: "Presentation.pptx", iconUrl: "https://macosicons.com/api/icons/Microsoft%20PowerPoint_macOS_Big_Sur/auto", type: "file" },
        { name: "Resume.docx", iconUrl: "https://macosicons.com/api/icons/Microsoft%20Word_macOS_Big_Sur/auto", type: "file" }
    ],
    
    // Add default browser tabs
    defaultTabs: [
        { title: 'New Tab', url: 'about:blank', favicon: 'https://macosicons.com/api/icons/Safari_macOS_Big_Sur/auto' }
    ],
    // Add default bookmarks
    defaultBookmarks: [
        { title: 'Google', url: 'https://www.google.com', favicon: 'https://www.google.com/favicon.ico' },
        { title: 'YouTube', url: 'https://www.youtube.com', favicon: 'https://www.youtube.com/favicon.ico' },
        { title: 'GitHub', url: 'https://github.com', favicon: 'https://github.com/favicon.ico' }
    ]
};