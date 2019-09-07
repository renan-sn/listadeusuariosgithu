
$(function() {

    /* ABRIR AREA DE BUSCA */
    $('strong#open-busca').on('click', function() {
        $('#div-form').slideToggle(100);

        let $textoAbreFecha = $(this).text();
        
        if ($textoAbreFecha === 'Abrir') {
            $textoAbreFecha = 'Fechar';
            $(this).text($textoAbreFecha);
        
        } else if ($textoAbreFecha === 'Fechar') {
            $textoAbreFecha = 'Abrir';
            $(this).text($textoAbreFecha);
        }
          
    });

        let $usuarioInArray = [];
        
    /* SOLICTAR BUSCA */
    $('#repo-form').on('submit', function(event) { 
        event.preventDefault();

        let $entradaDeTexto = document.getElementById('pesq');
        
        if ($entradaDeTexto.value.length === 0) {
            alert('Insira um nome de usuário');
            $entradaDeTexto.focus();
            return;
            
        } else {
            const $solicitacaoDeEntradaDeTexto = $entradaDeTexto.value; 
            buscaUsuario($solicitacaoDeEntradaDeTexto);
        }


        /* BUSCANDO DADOS NA API*/
        function buscaUsuario(usuario) {
            let $requisicaoApi = new XMLHttpRequest();

            $requisicaoApi.open('GET', `https://api.github.com/users/${usuario}`, true);

            $requisicaoApi.send(null);
            
            $requisicaoApi.onload = function() {
                if ($requisicaoApi.status !== 200) {
                    alert('Usuário não encontrado');
                    $entradaDeTexto.focus();
                    return;

                } else if ($requisicaoApi.status === 200) { 
                    processaDados();
                } 
            }

            
            /* PROCESSAR DADOS */
            function processaDados() { 
                let $usuarioRequisitado = JSON.parse($requisicaoApi.response);

                const { name, bio, avatar_url, html_url } = $usuarioRequisitado;

                /* ADICIONA USUARIO NO REPOSITORIO  */
                $usuarioInArray.push({ dadosDoUsuario: { name, bio, avatar_url, html_url } });
                
                adicionarUsuario();   
            }
            
            
            /* ADICIONAR USUARIO */
            function adicionarUsuario() {
                let $divResponse = $('div#response');                
                
                $usuarioInArray.forEach(function(item) {

                    /* ABREVIAR BIOGRAFIA */
                    let testeNome;
                    let testeBio;

                    if (item.dadosDoUsuario.name === null) {
                        testeNome = 'Sem nome';
                    }

                    if (item.dadosDoUsuario.bio === null) {
                        testeBio = 'Sem biografia';

                    }else if (item.dadosDoUsuario.bio.length != null) { 
                        item.dadosDoUsuario.bio.length <= 33 ? 
                        testeBio = item.dadosDoUsuario.bio : 
                        testeBio = item.dadosDoUsuario.bio.substring(0, 33) + '...';
                    }

                    /* CRIA ELEMENTOS */
                    let $avatar = $('<img src=' + "'" + `${item.dadosDoUsuario.avatar_url}` + "'" + " " + 'id=avatar>');
                    let $nome = $(`<strong id="name">${testeNome}</strong>`);
                    let $biografia = $(`<p id="bio">${testeBio} </p>`);
                    let $acessar = $('<a id="url" href=' + "'" + `${item.dadosDoUsuario.html_url}` + "'" + ' target="_blank"> Acessar</a>');

                    let $divResponseData = $('<div id="response-data"></div>');

                    let $elementosCarregados = $( $divResponseData.prepend(
                        $avatar,
                        $nome,
                        $biografia,
                        $acessar
                    ));
                    
                    $divResponse.append($elementosCarregados).slideDown(200);
                    
                });

                deletaDados();
            }
            
        }
    
        /* APAGA DADOS DO USUARIO, DA ENTRADA DE TEXTO E GANHA FOCO NOVAMENTE */
        function deletaDados() {
            $entradaDeTexto.value = '';
            $usuarioInArray = [];
            $entradaDeTexto.focus();
        }
        
    });
       

    // REMOVE ELEMENTOS DO DOM PARA ADICIONAR OUTROS */
    $('#resetInput').on('click', function(event) { 
        event.preventDefault();

        $('div#response-data').slideUp();
        $('div#response').css({ display: 'none'});

        $usuarioInArray = [];
    });

});
