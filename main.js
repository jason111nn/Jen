$(document).ready(function () {
  const apiUrl = "https://script.google.com/macros/s/AKfycbxisdPgLf46dfeZB9LLZTqsQzd0m9x60-sZoJOmR5U/dev";

  if ($("#portfolio-list").length) {
      showPortfolioList();
  }

  if ($("#gallery").length) {
      const urlParams = new URLSearchParams(window.location.search);
      const folderId = urlParams.get("folderId");
      if (folderId) {
          showPortfolioImages(folderId);
      } else {
          $("#gallery").html("<p>無法找到作品集</p>");
      }
  }

  // 1️⃣ 顯示所有作品集
  function showPortfolioList() {
      $.getJSON(apiUrl, function (data) {
          const container = $("#portfolio-list");
          container.empty();

          data.forEach(item => {
              const portfolioItem = $(`
                  <div class="portfolio-item">
                      <h3>${item.folderName}</h3>
                      <img src="${item.cover}" alt="封面圖片" class="portfolio-cover">
                      <button class="view-folder" data-folder="${item.folderId}">查看作品集</button>
                  </div>
              `);
              container.append(portfolioItem);
          });

          $(".view-folder").click(function () {
              const folderId = $(this).data("folder");
              window.location.href = `portfolio.html?folderId=${encodeURIComponent(folderId)}`;
          });
      }).fail(() => {
          $("#portfolio-list").html("<p>載入作品集失敗</p>");
      });
  }

  // 2️⃣ 顯示單個作品集內所有圖片
  function showPortfolioImages(folderId) {
      $.getJSON(apiUrl, function (data) {
          const item = data.find(folder => folder.folderId === folderId);
          if (!item) {
              $("#gallery").html("<p>作品集不存在</p>");
              return;
          }

          $("#gallery-title").text(`作品集：${item.folderName}`);
          const galleryContainer = $("#gallery");
          galleryContainer.empty();

          item.images.forEach(imgUrl => {
              galleryContainer.append(`<img src="${imgUrl}" class="gallery-image">`);
          });
      }).fail(() => {
          $("#gallery").html("<p>載入圖片失敗</p>");
      });
  }
});
