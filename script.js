const navThemeList = [false, true, false] //light, dark, light
const bodyTop = document.body.getBoundingClientRect().top
const pages = Array.from(document.getElementsByClassName("page"))
const offsets = pages.map(page => page.getBoundingClientRect().top - bodyTop)


document.addEventListener("scroll", () => {
  for (let i = navThemeList.length - 1; i >= 0; i--) {
    if (offsets[i] - (window.innerHeight / 12.5) <= window.scrollY) {
      document.getElementById("navbar").classList = navThemeList[i] ? "light" : "dark"
      break
    }
  }
})