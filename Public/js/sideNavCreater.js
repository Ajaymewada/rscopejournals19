var usefullLinks = [
  {
    title: "For Editors",
    link: "/usefull-links",
    icon: "fa-regular fa-pen-to-square",
    iconStyle: "font-size: 17px;margin-left:3px;margin-right:1px;",
  },
  {
    title: "Why Submit",
    link: "/whysubmit",
    icon: "ti ti-user-circle",
  },
  {
    title: "Artical Types",
    link: "/articletypes",
    icon: "ti ti-user",
  },
  {
    title: "Instructions &nbsp; For &nbsp; Authors",
    link: "/instructions",
    icon: "ti ti-aperture",
  },
  {
    title: "Processing &nbsp; Fee",
    link: "/proccessing-charge",
    icon: "ti ti-currency-dollar",
  },
  {
    title: "Submission CheckList",
    link: "/submission-checklist",
    icon: "fa-regular fa-square-check",
    iconStyle: "font-size: 17px;margin-left:3px;margin-right:1px;",
  },
  {
    title: "Peer Review",
    link: "/peerreview",
    icon: "fa-regular fa-square-check",
    iconStyle: "font-size: 17px;margin-left:3px;margin-right:1px;",
  },
  // <i class="fa-regular fa-square-check"></i>
];
var mainMenuLinks = [
  {
    title: "Add Journal",
    link: "/admin",
    icon: "ti ti-list-details",
  },
  {
    title: "Cover Banner",
    link: "/coverbanner",
    icon: "ti ti-cards",
  },
  {
    title: "Aims and Scope",
    link: "/aimsscope",
    icon: "ti ti-activity-heartbeat",
  },
  {
    title: "Editorial &nbsp; Board",
    link: "/editorialboard",
    icon: "fa-regular fa-pen-to-square",
    iconStyle: "font-size: 17px;margin-left:3px;margin-right:1px;",
  },

  {
    title: "Editors &nbsp; Management",
    link: "/editors-management",
    icon: "ti ti-user-circle",
  },
  {
    title: "Editorialoffice",
    link: "/editorialoffice",
    icon: "fa-regular fa-address-book",
    iconStyle: "font-size: 17px;margin-left:3px;margin-right:1px;",
  },

  {
    title: "Journal Management",
    link: "/journal-management",
    icon: "fa-regular fa-pen-to-square",
    iconStyle: "font-size: 17px;margin-left:3px;margin-right:1px;",
  },
];
var articleAddLinks = [
  {
    title: "Add Article",
    link: "/article",
    icon: "ti ti-list-details",
  },
  {
    title: "Article Management",
    link: "/manage-article",
    icon: "ti ti-cards",
  },
  {
    title: "Create Volume",
    link: "/create-volume",
    icon: "ti ti-layout-sidebar",
  },
  {
    title: "Issues",
    link: "/manage-issues",
    icon: "ti ti-table-filled",
  },
  {
    title: "In Press",
    link: "/in-press-management",
    icon: "ti ti-file-analytics",
  },
];
class GenerateSideNav {
  constructor() {
    // Constructor, if needed
  }
  create(page, activeTxt) {
    let ListItem = "";
    var links = [];
    if (page == "usefullLinks") {
      links = usefullLinks;
    } else if (page == "mainMenu") {
      links = mainMenuLinks;
    } else if (page == "articlelinks") {
      links = articleAddLinks;
    }
    links.forEach((element) => {
      if (element.title === activeTxt) {
        ListItem += `<li class="sidebar-item">
                            <a class="sidebar-link active protected-link" onclick="navigatetopage('${element.link}')" href="#" aria-expanded="false">
                                <span>
                                     <i class="${element.icon}" style="${element.iconStyle}"></i>
                                </span>
                                <span class="hide-menu">${element.title}</span>
                            </a>
                            </li>`;
      } else {
        ListItem += `<li class="sidebar-item">
                            <a class="sidebar-link protected-link" onclick="navigatetopage('${element.link}')" href="#" aria-expanded="false">
                                 <span>
                                      <i class="${element.icon}" style="${element.iconStyle}"></i>
                                </span>
                                <span class="hide-menu">${element.title}</span>
                            </a>
                            </li>`;
      }
    });
    return ListItem;
  }

  createMobileNav() {
    let finalLinks = "";
    let menulinks = "";
    let articlelinks = "";
    let usefulllinks = "";
    mainMenuLinks.forEach((element) => {
      menulinks += `<li class="sidebar-item py-2">
                                <a href="#" onclick="navigatetopage('${element.link}')" class="d-flex align-items-center">
                                    <div class="bg-light rounded-1 me-3 p-6 d-flex align-items-center justify-content-center">
                                        <i class="${element.icon}"></i>
                                    </div>
                                    <div class="d-inline-block active">
                                        <h6 class="mb-1 bg-hover-primary">${element.title}</h6>
                                    </div>
                                </a>
                            </li>`;
    });
    articleAddLinks.forEach((element) => {
      articlelinks += `<li class="sidebar-item py-2">
                                <a href="#" onclick="navigatetopage('${element.link}')" class="d-flex align-items-center">
                                    <div class="bg-light rounded-1 me-3 p-6 d-flex align-items-center justify-content-center">
                                        <i class="${element.icon}"></i>
                                    </div>
                                    <div class="d-inline-block active">
                                        <h6 class="mb-1 bg-hover-primary">${element.title}</h6>
                                    </div>
                                </a>
                            </li>`;
    });
    usefullLinks.forEach((element) => {
      usefulllinks += `<li class="sidebar-item py-2">
                                <a href="#" onclick="navigatetopage('${element.link}')" class="d-flex align-items-center">
                                    <div class="bg-light rounded-1 me-3 p-6 d-flex align-items-center justify-content-center">
                                        <i class="${element.icon}"></i>
                                    </div>
                                    <div class="d-inline-block active">
                                        <h6 class="mb-1 bg-hover-primary">${element.title}</h6>
                                    </div>
                                </a>
                            </li>`;
    });
    finalLinks += `<li class="sidebar-item">
                    <a class="sidebar-link has-arrow" href="javascript:void(0)" aria-expanded="false">
                        <span>
                            <i class="ti ti-apps"></i>
                        </span>
                        <span class="hide-menu">Main Menu</span>
                    </a>
                    <ul aria-expanded="false" class="collapse first-level my-3" id="mainMenuSidebar">
                        ${menulinks}
                    </ul>
                </li>`;
    finalLinks += `<li class="sidebar-item">
                    <a class="sidebar-link has-arrow" href="javascript:void(0)" aria-expanded="false">
                        <span>
                            <i class="ti ti-apps"></i>
                        </span>
                        <span class="hide-menu">Article</span>
                    </a>
                    <ul aria-expanded="false" class="collapse first-level my-3" id="articleMenuSidebar">
                        ${articlelinks}
                    </ul>
                </li>`;
    finalLinks += `<li class="sidebar-item">
                    <a class="sidebar-link has-arrow" href="javascript:void(0)" aria-expanded="false">
                        <span>
                            <i class="ti ti-apps"></i>
                        </span>
                        <span class="hide-menu">Use Full Links</span>
                    </a>
                    <ul aria-expanded="false" class="collapse first-level my-3" id="usefulLinksSidebar">
                        ${usefulllinks}
                    </ul>
                </li>`;
    return finalLinks;
  }
}
