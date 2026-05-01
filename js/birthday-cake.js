// Bolo + vela: clique para "assoprar" e apagar a chama
(function () {
    function blowOut(wrap, hint) {
        if (wrap.classList.contains('is-blown')) return;
        wrap.classList.add('is-blown');
        if (hint) {
            hint.textContent = 'Apagou. Pedido guardado. 🖤';
            hint.hidden = false;
        }
    }

    function initBirthdayCake() {
        const wrap = document.getElementById('birthdayCakeWrap');
        const btn = document.getElementById('cakeCandleBtn');
        const hint = document.getElementById('cakeHint');
        if (!wrap || !btn) return;

        function onActivate(e) {
            e.preventDefault();
            blowOut(wrap, hint);
        }

        btn.addEventListener('click', onActivate);
        btn.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                onActivate(e);
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBirthdayCake);
    } else {
        initBirthdayCake();
    }
})();
