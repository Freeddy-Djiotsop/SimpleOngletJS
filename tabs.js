(function()
 {
    var afficherOnglet = function (e, animations)
    {
        if(animations===undefined)
            animations = true;
        var li = e.parentNode;//on veut avooir acces a pere de e
        var div = e.parentNode.parentNode.parentNode;//on veut avooir acces a l'arrier grand-pere de e

        var activeTab = div.querySelector(".tab-content.active");//contenu activ
        var aAfficher = div.querySelector(e.getAttribute("href"));//contenu a afficher

        if(li.classList.contains("active"))
            return false;//puiskon ne veut pas effectuer loperation sur un element qui a deja active on verife si lelement sur lekel on a clique a deja active, si c le cas on sort de la fonction.

        //on retire active sur l'Onglet
        div.querySelector(".tabs .active").classList.remove("active");//Il est important qu'il ait qu'un seul element dans tt le div qui soit active sinon cette ligne ne sert pas a grande chose. c ce seul element quon lui donne en parametre et il suprimé
        //puis ajoute sur l'element qui fut clique 
        li.classList.add("active");

        /*//Ici c qnd c sans animation
        //On retire active sur le contenue
        div.querySelector(".tab-content.active").classList.remove("active");
        //on l'ajoute en tenant compte de l'id de l'onglet qui fur cliqué
        //This.href donne le chemin complet, or ici nous n'avon besion que de l'attribut ou de l'id qu'on a mit dans le href dans le html
        div.querySelector(e.getAttribute("href")).classList.add("active");*/

        /**/

        if(animations)//Si on veut animation
        {
            activeTab.classList.add("fade");//On ajoute fade sur le contenu activ pour que la transiction kon a ecrit dans le css se cree, fade ne sera ajoute que s'il n'existe pas deja a cet endroit
            activeTab.classList.remove("in")//puiskon utilise in dans le css pour rendre le prochain contenu visible avec opacite=1, on enleve donc in pour que .fade soit utilise sur le contenu actif ainsi la transition peut etre declencher

            //ET LA la prochaine ligne a etre excetuté ici c l'avant derniere ligne apres la transition declanche par le css

            //Il est important de supprimer les evenements sinon ils sont s'accumuler si on change d'onglet plus fois et la page va commencer a se comporter bizarement, d'ou l'importance de sauveguarder la fonction(Levenement) qu'on envoie dans la fonction addE, pour pouvoir supprimer l'evenement apres kil soit finit
            var transitionend = function(e)
            {
                //puis que la transition es finit on retire fade et in sinon la transiction se fera a l'infinie, un peu comme une coleur kon met sur un text
                e.classList.remove("fade");
                e.classList.remove("active");
                aAfficher.classList.add("active");
                aAfficher.classList.add("fade");
                aAfficher.offsetWidth/*C juste pour forcer le navigateur a cree l'effet d'apparution qnd il excetute ce code, par ce que par defaut dans le but d'economiser les ressource le naviguateur enregistre toutes nos commande et les excetute une fois*/
                aAfficher.classList.add("in");
                activeTab.removeEventListener("transitionend", transitionend);//et c supprimer transitionend lorsque la transition est fini, sans () parce que avec () c appel or ici on veut supprimer

                //Pour que xa fonctionne aussi sans pb sur certains vieux navigateur
                activeTab.removeEventListener("webkitTransitionEnd", transitionend);
                activeTab.removeEventListener("oTransitionEnd", transitionend);
                //Il existe cependant des methode pour detecter dynamiquement la bonne a utiliser

            }

            //A la fin de la transiction que nous avons cree dans le css on exceutera ce code en bas
            activeTab.addEventListener("transitionend", transitionend(activeTab));//si la transition est fini appele la fonction transitionend, il est tres important de premierement appele la fkt dans un Event sans () si sa ne marche pas comme tu veut avant tu ajoute les () et lui donne le parametre kil faut, Ici je l'ai fait ca pas donne avant que j'ai ajoute ()

            //Pour que xa fonctionne aussi sans pb sur certains vieux navigateur
            activeTab.addEventListener("webkitTransitionEnd", transitionend(activeTab));
            activeTab.addEventListener("oTransitionEnd", transitionend(activeTab));
        }
        else
        {
            aAfficher.classList.add("active");//puiskon ne veut pas d'animation on ajoute pas fade et in
            activeTab.classList.remove("active");//et on n'ouble pas d'enlever active sur l'ancien element
        }
    }



    var tabs = document.querySelectorAll(".tabs a");//tous les a qui sont dans la class tab sont sauvegarder dans tabs

    for (var i=0; i<tabs.length; i++)
    {
        tabs[i].addEventListener("click", function()
        {
            afficherOnglet(this, true);//true pour dire que je veux afficher avec une animation, bien que c pas oblige puiskon a dit que si animation est defini on le defini a true
        }
                                );
    }

    //Lorsque le hash change on veut excetuer cette fonction, le hash change qns on reactualise la page ou qnd on rentre avec le navigateur<-
    var hashchange = function(e)//On peut ajouter un parametre si on veut que la transition se fasse aussi lorskon appuie sur <- dans le navigatuer
    {
        //Ce code nous aide afficher le hash l'onglet sur lequel son se trouve a tout momment mm qnd la page est reactualise, le hash c generalement #id qui est sur url du navigateur
        var hash = window.location.hash;
        var a = document.querySelector('a[href="'+hash+'"]');
        if(a !==null && !a.parentNode.classList.contains("active"))
            afficherOnglet(a,e!==undefined);//e represente un Event ici, lorskon charge ou actualise la page, ce n'est pas un Event du coup e=undefined la fkt est appele avec false, si parcontre on a clique sur <- qui est un Event du Window e!=undefined et la fkt sera appele avec true etil y aura animation lors du chargement.

        //Pour tout ce code d'en haut on aurait pu utiliser une fonction qui s'autoappelle, le seul in convaninant est qu'on n'aura plus les valeurs reelle a la console sur le navigateur
    }

    window.addEventListener("hashchange", hashchange);//Qnd on clique sur <- dans le navigatuer elle sera excecuté, il est tres important de premierement appele la fkt dans un Event sans () si sa ne marche pas comme tu veut avant tu ajoute les () et lui donne le parametre kil faut

    hashchange();//lorskon va reactualiser notre page, ou lorsque la page charge
})();