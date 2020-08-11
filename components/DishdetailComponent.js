import React, { Component, Suspense } from 'react';
import { Text, View, ScrollView, FlatList, StyleSheet, Modal, Button } from 'react-native';
import { Card, Icon, Rating, Input } from 'react-native-elements';
import { DISHES } from '../shared/dishes';
import { COMMENTS } from '../shared/comments';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite, postComment } from '../redux/ActionCreators';

const mapStateToProps = state => {
    return {
      dishes: state.dishes,
      comments: state.comments,
      favorites: state.favorites
    }
  }

const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId)),
    postComment: (dishId, rating, author, comment) => dispatch(postComment(dishId, rating, author, comment))
})

function RenderDish(props) {

    const dish = props.dish;
    
        if (dish != null) {
            return(
                <Card
                featuredTitle={dish.name}
                image={{uri: baseUrl + dish.image}}>
                    <Text style={{margin: 10}}>
                        {dish.description}
                    </Text>
                    <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                        <Icon
                            raised
                            reverse
                            name={ props.favorite ? 'heart' : 'heart-o'}
                            type='font-awesome'
                            color='#f50'
                            onPress={() => props.favorite ? console.log('Already favorite') : props.onPress()}
                        />
                        <Icon
                            raised
                            reverse
                            name='pencil'
                            type='font-awesome'
                            color='#512DA7'
                            onPress={() => props.toggleModal()}
                        />
                    </View>
                </Card>
            );
        }
        else {
            return(<View></View>);
        }
}


function RenderComments(props) {

    const comments = props.comments;
            
    const renderCommentItem = ({item, index}) => {
        
        return (
            <View key={index} style={{margin: 10}}>
                <Text style={{fontSize: 14}}>{item.comment}</Text>
                <Rating
                    style={ styles.starAlign }
                    imageSize={20}
                    readonly
                    startingValue={item.rating}
                    />                
                <Text style={{fontSize: 12}}>{'-- ' + item.author + ', ' + item.date} </Text>
            </View>
        );
    };
    
    return (
        <Card title='Comments' >
        <FlatList 
            data={comments}
            renderItem={renderCommentItem}
            keyExtractor={item => item.id.toString()}
            />
        </Card>
    );
}

class Dishdetail extends Component {
    
    constructor(props){
        super(props)
            this.state = {
            rating: 1,
            author:'',
            comment: '',
            showModal: false
            
        }
    }

    toggleModal() {
        this.setState({showModal: !this.state.showModal});
    }

    handleComment(dishId) {
        console.log(JSON.stringify(this.state));
        this.props.postComment(dishId, this.state.rating, this.state.author, this.state.comment);
        this.toggleModal();
    }

    resetForm() {
        this.setState({
            rating: 1,
            author:'',
            comment: '',
            showModal: false
        });
    }

    markFavorite(dishId) {
        this.props.postFavorite(dishId);
    }

    static navigationOptions = {
        title: 'Dish Details'
    };

    render() {
        const dishId = this.props.navigation.getParam('dishId','');
        return(
            <ScrollView>
                <RenderDish dish={this.props.dishes.dishes[+dishId]}
                    favorite={this.props.favorites.some(el => el === dishId)}
                    onPress={() => this.markFavorite(dishId)} 
                    toggleModal={() => this.toggleModal()}
                    />
                <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} />
                <Modal animationType = {"slide"} transparent = {false}
                    visible = {this.state.showModal}
                    onDismiss = {() => {this.toggleModal(); this.resetForm()}}
                    onRequestClose = {() => {this.toggleModal(); this.resetForm()} }>
                    <View style = {styles.modal}>                        
                        <Rating 
                            startingValue={this.state.rating}
                            showRating
                            fractions={1}                            
                            onFinishRating={(rating) => this.setState({rating: rating})}>
                        </Rating>
                        <Input
                            leftIcon={{type: 'font-awesome', name:'user-o'}}
                            placeholder='Author'
                            onChangeText = {(text) => this.setState({author: text})}
                            />
                        <Input
                            leftIcon={{type: 'font-awesome', name:'comment-o'}}
                            placeholder='Comment'
                            onChangeText = {(text) => this.setState({comment: text})}
                            />
                        <View style = {styles.Custompadding}>
                            <Button
                                raised 
                                title='SUBMIT'
                                color='#512DA8'
                                onPress={() => this.handleComment(dishId)}
                                style = { styles.Custompadding }
                                />
                        </View>
                        <View style = {styles.Custompadding}>
                            <Button style = {styles.Custompadding}
                                raised
                                title='CANCEL'
                                color='#585858'
                                onPress={() => {this.toggleModal(); this.resetForm()}}                            
                                />
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    formRow: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      flexDirection: 'column',
      margin: 20
    },
    modal: {
        justifyContent: 'center',
        margin: 20
     },
     Custompadding: {
        paddingTop: 20
     },
     starAlign: {
         alignItems: 'flex-start'
     }
});

export default connect(mapStateToProps, mapDispatchToProps)(Dishdetail);