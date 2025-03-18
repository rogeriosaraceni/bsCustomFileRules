$(document).ready(function () {
    // Função para preencher o tooltip automaticamente
    function tooltipFileCustom(wrapper) {
        const tooltip = wrapper.find('.tooltipFileTypes');
        const fileSizeText = wrapper.find('.custom-file').data('file-size-text');
        const extensionsText = wrapper.find('.custom-file').data('file-extensions');

        // Define o conteúdo do tooltip
        const tooltipContent = `Tamanho máximo do arquivo: ${fileSizeText}. Extensões permitidas: ${extensionsText}`;
        tooltip.attr('data-bs-title', tooltipContent);

        // Inicializa o tooltip do Bootstrap
        new bootstrap.Tooltip(tooltip[0]);
    }

    // Função para verificar o anexo
    function checkAttachment(wrapper) {
        const fileInput = wrapper.find('input[type="file"]');
        const fileBtns = wrapper.find('.btns');
        const label = wrapper.find('.custom-file-label');
        const delBtn = wrapper.find('.delBtn');

        // Obtém as regras personalizadas do contêiner
        const fileSizeText = wrapper.find('.custom-file').data('file-size-text');
        const fileSizeBite = parseInt(wrapper.find('.custom-file').data('file-size-bite'));
        const extensionsText = wrapper.find('.custom-file').data('file-extensions');
        const extensions = new RegExp(`(${extensionsText.split(', ').join('|')})$`, 'i');

        const filePath = fileInput.val() || label.text(); // Obtém o caminho do arquivo do input ou do label
        //console.log(filePath);
        
        // Verifica a extensão do arquivo
        if (!extensions.exec(filePath) && filePath !== "") {
            alert(`Fora das extensões permitidas: ${extensionsText}`);
            fileBtns.hide();
            fileInput.val("");
            label.text("");
            return false;
        }

        // Verifica o tamanho do arquivo (apenas para novos arquivos selecionados)
        if (fileInput[0].files && fileInput[0].files[0] && fileInput[0].files[0].size > fileSizeBite) {
            alert(`Excede o tamanho máximo de: ${fileSizeText}!`);
            fileBtns.hide();
            fileInput.val("");
            label.text("");
            return false;
        }

        // Exibe ou oculta os botões de download e delete
        if (filePath.length > 0) {
            fileBtns.show();
            label.text(filePath.split("\\").pop()); // Exibe o nome do arquivo no label
        } else {
            fileBtns.hide();
        }

        // Remove o listener antigo (se existir) e adiciona um novo
        delBtn.off('click').on('click', function (e) {
            e.preventDefault();

            // Exibe um alerta de confirmação
            const confirmDelete = confirm("Deseja realmente excluir este anexo?");
            if (confirmDelete) {
                fileBtns.hide();
                fileInput.val("");
                label.text("");
            }
        });
    }

    // Inicializa a verificação do anexo e o tooltip para todos os contêineres com data-bs-file="custom"
    $('.wrapper-bs-file-custom[data-bs-file="custom"]').each(function () {
        const wrapper = $(this);

        // Configura o tooltip
        tooltipFileCustom(wrapper);

        // Aplica a função de verificação de anexo
        checkAttachment(wrapper);

        // Adiciona o evento de change ao input file
        wrapper.find('input[type="file"]').on('change', function () {
            checkAttachment(wrapper);
        });
    });
});
