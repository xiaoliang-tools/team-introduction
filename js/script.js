// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 特征选项卡切换功能
    const featureBtns = document.querySelectorAll('.feature-btn');
    const featureContents = document.querySelectorAll('.feature-content');
    let featureAutoPlayTimeout = null;
    
    featureBtns.forEach(btn => {
        btn.addEventListener('click', function(event) {
            // 停止自动轮播
            stopFeatureAutoPlay();
            
            // 切换按钮和内容
            switchFeatureTab(this.getAttribute('data-tab'));
        });
    });
    
    // 切换特征标签页
    function switchFeatureTab(tabId) {
        // 移除所有按钮的active类
        featureBtns.forEach(b => b.classList.remove('active'));
        
        // 找到对应的按钮并添加active类
        const activeBtn = document.querySelector(`.feature-btn[data-tab="${tabId}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
        
        // 隐藏所有内容
        featureContents.forEach(content => content.classList.remove('active'));
        
        // 显示对应内容
        const activeContent = document.getElementById(tabId);
        if (activeContent) {
            activeContent.classList.add('active');
        }
    }
    
    // 开始特征内容自动轮播
    function startFeatureAutoPlay() {
        if (featureAutoPlayTimeout) {
            clearTimeout(featureAutoPlayTimeout);
        }
        
        let currentIndex = 0;
        const tabIds = [];
        
        // 收集所有特征标签ID
        featureBtns.forEach(btn => {
            tabIds.push(btn.getAttribute('data-tab'));
        });
        
        // 如果没有特征标签，直接返回
        if (tabIds.length === 0) return;
        
        // 设置当前活跃标签的索引
        const activeBtn = document.querySelector('.feature-btn.active');
        if (activeBtn) {
            const activeTabId = activeBtn.getAttribute('data-tab');
            const activeIndex = tabIds.indexOf(activeTabId);
            if (activeIndex !== -1) {
                currentIndex = activeIndex;
            }
        }
        
        // 自动轮播函数
        function autoPlayFeature() {
            // 更新索引到下一个
            currentIndex = (currentIndex + 1) % tabIds.length;
            
            // 切换到下一个标签
            switchFeatureTab(tabIds[currentIndex]);
            
            // 如果已经轮播一圈(回到第一个)，则停止
            if (currentIndex === 0) {
                return; // 不再继续轮播
            }
            
            // 设置下一次轮播
            featureAutoPlayTimeout = setTimeout(autoPlayFeature, 4000);
        }
        
        // 开始第一次轮播（延迟4秒）
        featureAutoPlayTimeout = setTimeout(autoPlayFeature, 4000);
    }
    
    // 停止特征内容自动轮播
    function stopFeatureAutoPlay() {
        if (featureAutoPlayTimeout) {
            clearTimeout(featureAutoPlayTimeout);
            featureAutoPlayTimeout = null;
        }
    }
    
    // 游戏案例选项卡切换功能
    const gameBtns = document.querySelectorAll('.game-btn');
    const gameContents = document.querySelectorAll('.game-content');
    
    // 存储所有自动轮播定时器
    let autoSlideIntervals = {};
    
    // 初始化所有轮播
    initAllCarousels();
    
    // 开始特征按钮自动轮播
    startFeatureAutoPlay();
    
    gameBtns.forEach(btn => {
        btn.addEventListener('click', function(event) {
            // 停止所有轮播
            stopAllAutoSlides();
            
            // 移除所有按钮的active类
            gameBtns.forEach(b => b.classList.remove('active'));
            // 为当前按钮添加active类
            this.classList.add('active');
            
            // 隐藏所有内容
            gameContents.forEach(content => content.classList.remove('active'));
            
            // 显示对应内容
            const tabId = this.getAttribute('data-tab');
            const activeContent = document.getElementById(tabId);
            activeContent.classList.add('active');
            
            // 重新启动当前内容的轮播
            initCarousel(activeContent);
        });
    });
    
    // 复制邮箱功能
    const copyBtn = document.getElementById('copyEmail');
    const emailText = document.querySelector('.email').innerText.split('详情联系')[1];
    
    copyBtn.addEventListener('click', function(event) {
        // 创建一个临时元素
        const tempInput = document.createElement('input');
        tempInput.value = emailText;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        
        // 显示已复制提示
        const tooltip = document.createElement('div');
        tooltip.style.position = 'fixed';
        tooltip.style.background = 'rgba(0, 0, 0, 0.7)';
        tooltip.style.color = 'white';
        tooltip.style.padding = '5px 10px';
        tooltip.style.borderRadius = '4px';
        tooltip.style.fontSize = '14px';
        tooltip.style.zIndex = '9999';
        tooltip.style.top = (event.clientY - 30) + 'px';
        tooltip.style.left = event.clientX + 'px';
        tooltip.style.transform = 'translateX(-50%)';
        tooltip.style.transition = 'opacity 0.3s';
        tooltip.innerText = '已复制';
        
        document.body.appendChild(tooltip);
        
        // 保留邮箱复制的烟花效果
        createFirework(event.clientX, event.clientY);
        
        // 2秒后移除提示
        setTimeout(function() {
            tooltip.style.opacity = '0';
            setTimeout(function() {
                document.body.removeChild(tooltip);
            }, 300);
        }, 2000);
    });
    
    // 初始化所有轮播
    function initAllCarousels() {
        // 先停止所有已有的轮播
        stopAllAutoSlides();
        
        // 找到当前活跃的游戏内容并初始化其轮播
        const activeGameContent = document.querySelector('.game-content.active');
        if (activeGameContent) {
            initCarousel(activeGameContent);
        }
    }
    
    // 停止所有自动轮播
    function stopAllAutoSlides() {
        // 清除所有定时器
        Object.keys(autoSlideIntervals).forEach(key => {
            clearInterval(autoSlideIntervals[key]);
        });
        
        // 重置定时器对象
        autoSlideIntervals = {};
    }
    
    // 初始化特定内容区域的轮播
    function initCarousel(content) {
        const contentId = content.id;
        const carouselItems = content.querySelectorAll('.carousel-item');
        const currentSlide = content.querySelector('.current-slide');
        const totalSlides = content.querySelector('.total-slides');
        const prevBtn = content.querySelector('.carousel-prev');
        const nextBtn = content.querySelector('.carousel-next');
        
        // 只有当有多于一张图片时才设置轮播
        if (carouselItems.length > 1) {
            // 设置总数
            if (totalSlides) {
                totalSlides.textContent = carouselItems.length;
            }
            
            // 重置到第一张
            setActiveItem(carouselItems, 0);
            if (currentSlide) {
                currentSlide.textContent = '1';
            }
            
            // 前一个案例按钮点击事件
            if (prevBtn) {
                prevBtn.addEventListener('click', function() {
                    navigateCarousel(content, 'prev');
                });
            }
            
            // 后一个案例按钮点击事件
            if (nextBtn) {
                nextBtn.addEventListener('click', function() {
                    navigateCarousel(content, 'next');
                });
            }
            
            // 点击案例图片跳转
            carouselItems.forEach(item => {
                item.addEventListener('click', function() {
                    const url = this.getAttribute('data-url');
                    if (url && url !== '#') {
                        window.open(url, '_blank');
                    }
                });
            });
            
            // 支持触摸滑动
            let touchStartX = 0;
            let touchEndX = 0;
            
            content.addEventListener('touchstart', e => {
                touchStartX = e.changedTouches[0].screenX;
            }, false);
            
            content.addEventListener('touchend', e => {
                touchEndX = e.changedTouches[0].screenX;
                
                // 左滑：下一张
                if (touchEndX < touchStartX - 50) {
                    navigateCarousel(content, 'next');
                }
                // 右滑：上一张
                if (touchEndX > touchStartX + 50) {
                    navigateCarousel(content, 'prev');
                }
            }, false);
            
            // 启动自动轮播
            startAutoSlide(content);
        }
    }
    
    // 导航轮播
    function navigateCarousel(content, direction) {
        const contentId = content.id;
        const carouselItems = content.querySelectorAll('.carousel-item');
        const currentSlide = content.querySelector('.current-slide');
        
        let activeIndex = getActiveIndex(carouselItems);
        let newIndex;
        
        if (direction === 'next') {
            newIndex = (activeIndex + 1) % carouselItems.length;
        } else {
            newIndex = (activeIndex - 1 + carouselItems.length) % carouselItems.length;
        }
        
        setActiveItem(carouselItems, newIndex);
        
        if (currentSlide) {
            currentSlide.textContent = newIndex + 1;
        }
        
        // 重置自动轮播
        startAutoSlide(content);
    }
    
    // 开始自动轮播
    function startAutoSlide(content) {
        const contentId = content.id;
        
        // 如果已经有自动轮播，先清除
        if (autoSlideIntervals[contentId]) {
            clearInterval(autoSlideIntervals[contentId]);
        }
        
        // 设置新的自动轮播
        autoSlideIntervals[contentId] = setInterval(() => {
            navigateCarousel(content, 'next');
        }, 3500);
    }
    
    // 获取当前活跃项目的索引
    function getActiveIndex(items) {
        for (let i = 0; i < items.length; i++) {
            if (items[i].classList.contains('active')) {
                return i;
            }
        }
        return 0;
    }
    
    // 设置活跃项目
    function setActiveItem(items, index) {
        // 先找到当前活跃的项目
        const currentActiveIndex = getActiveIndex(items);
        
        // 如果新的索引与当前活跃索引相同，不做任何操作
        if (currentActiveIndex === index) return;
        
        // 确定滑动方向
        const direction = index > currentActiveIndex ? 'right' : 'left';
        
        // 将即将激活的项目放在正确的起始位置
        if (direction === 'right') {
            // 向右滑动时，新元素从右侧进入
            items[index].style.transform = 'translateX(100%)';
        } else {
            // 向左滑动时，新元素从左侧进入
            items[index].style.transform = 'translateX(-100%)';
        }
        
        // 显示即将激活的项目，但还不要添加active类
        items[index].style.display = 'block';
        
        // 给浏览器一点时间来处理初始显示
        setTimeout(() => {
            // 将当前活跃项目滑出
            if (currentActiveIndex !== -1) {
                if (direction === 'right') {
                    // 向右滑动时，旧元素向左退出
                    items[currentActiveIndex].style.transform = 'translateX(-100%)';
                } else {
                    // 向左滑动时，旧元素向右退出
                    items[currentActiveIndex].style.transform = 'translateX(100%)';
                }
                items[currentActiveIndex].style.opacity = '0';
                
                // 移除活跃类
                items[currentActiveIndex].classList.remove('active');
            }
            
            // 将新项目滑入
            items[index].style.transform = 'translateX(0)';
            items[index].style.opacity = '1';
            items[index].classList.add('active');
            
            // 动画结束后，隐藏非活跃项目
            setTimeout(() => {
                items.forEach((item, i) => {
                    if (i !== index) {
                        item.style.display = 'none';
                    }
                });
            }, 500); // 与CSS过渡时间相匹配
        }, 50);
    }
    
    // 烟花动效功能
    function createFirework(x, y) {
        const fireworksContainer = document.getElementById('fireworks-container');
        const colors = ['#ffcccb', '#c8e6c9', '#bbdefb', '#fff9c4', '#e1bee7', '#b3e5fc']; // 更柔和的颜色
        
        // 创建烟花粒子
        for (let i = 0; i < 8; i++) { // 减少粒子数量
            const firework = document.createElement('div');
            firework.className = 'firework';
            firework.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            firework.style.left = x + 'px';
            firework.style.top = y + 'px';
            
            // 随机旋转
            const rotation = Math.random() * 360;
            firework.style.transform = `rotate(${rotation}deg)`;
            
            fireworksContainer.appendChild(firework);
            
            // 动画结束后移除元素
            setTimeout(() => {
                if (firework.parentNode === fireworksContainer) {
                    fireworksContainer.removeChild(firework);
                }
            }, 1000);
        }
    }
    
    // 初始随机烟花效果
    function randomFireworks() {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        const x = Math.random() * windowWidth;
        const y = Math.random() * (windowHeight * 0.6); // 主要在上半部分显示
        
        createFirework(x, y);
        
        // 改为2.5秒触发一次随机烟花
        setTimeout(randomFireworks, 2500);
    }
    
    // 启动随机烟花
    setTimeout(randomFireworks, 1000);
}); 